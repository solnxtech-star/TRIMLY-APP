from api.v1.Payments.models import Transaction
from .serializers import BookingRescheduleSerializer, BookingSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import  permissions
from api.v1.Users.permissions import IsBookingOwnerOrProvider , BookingActionPermission
from .models import Booking
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .serializers import BookingSerializer, VerifyNinSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .tasks import auto_complete_booking, send_booking_notifications, send_reminder_task, warn_customer_of_autocomplete
from datetime import timedelta
from api.v1.Notifications.tasks  import create_and_send_notification
from rest_framework.views import APIView
from .utils import verify_nin
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema



import os
from datetime import datetime, timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from celery import current_app



class BookingViewSet(ModelViewSet):
    """
    Production Engine handling Bookings for Admins, Salon Owners, Independent Vendors, and Clients.
    Manages state machine transitions, automated escrow/wallet entries, and real-time Celery task synchronization.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsBookingOwnerOrProvider, BookingActionPermission]

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["status", "date", "salon_service", "vendor_service"]
    ordering_fields = ["date", "created_at"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            queryset = Booking.objects.all()
        elif user.role == "salon_owner":
            queryset = Booking.objects.filter(salon_service__salon__owner=user)
        elif user.role == "individual_vendor":
            queryset = Booking.objects.filter(vendor_service__vendor__worker=user)
        else:
            queryset = Booking.objects.filter(customer=user)
        
        if self.action == 'retrieve':
            queryset = queryset.select_related(
                'customer', 'salon_service__salon', 'vendor_service__vendor__worker'
            )
        return queryset

    def get_permissions(self):
        """
        Dynamically adjusts permission boundaries based on the current execution target.
        """
        if self.action == 'reschedule':
            return [permissions.IsAuthenticated(), IsBookingOwnerOrProvider()]
        return [permission() for permission in self.permission_classes]

    def schedule_booking_automation_tasks(self, booking):
            """
            PRODUCTION TASK ENGINE:
            Evicts any dead or historical scheduled tasks from the Celery message broker
            and maps out fresh execution timelines to keep notifications and autocompletes accurate.
            """
            old_task_ids = [booking.reminder_task_id, booking.warning_task_id, booking.payout_task_id]
            for task_id in old_task_ids:
                if task_id:
                    try:
                        current_app.control.revoke(task_id, terminate=True)
                    except Exception as e:
                        print(f"[-] Non-breaking task eviction failure on Broker level: {e}")

            # 1. Capture the raw datetime object from the property
            raw_appt_time = booking.appointment_datetime  
            if not raw_appt_time:
                print("[-] Automation Error: appointment_datetime could not be parsed.")
                return

            # 2. FIX: Force the naive property object to become timezone-aware
            if timezone.is_naive(raw_appt_time):
                appt_time = timezone.make_aware(raw_appt_time, timezone.get_current_timezone())
            else:
                appt_time = raw_appt_time

            # 3. Establish production timeline limits safely using aware datetimes
            reminder_eta = appt_time - timedelta(hours=1) 
            payout_eta = appt_time + timedelta(hours=24)
            warning_eta = payout_eta - timedelta(hours=2)

            now = timezone.now()

            vendor_email = (
                booking.vendor_service.vendor.worker.email 
                if booking.vendor_service 
                else booking.salon_service.salon.owner.email
            )

            # 4. Offload fresh tasks to Celery with strict future-only ETA validation guards
            if reminder_eta > now:
                reminder_res = send_reminder_task.apply_async(
                    args=[booking.customer.email, vendor_email, booking.customer.username, booking.date, booking.start_time],
                    eta=reminder_eta
                )
                booking.reminder_task_id = reminder_res.id
            else:
                booking.reminder_task_id = None

            if warning_eta > now:
                warning_res = warn_customer_of_autocomplete.apply_async(
                    args=[booking.id], 
                    eta=warning_eta
                )
                booking.warning_task_id = warning_res.id
            else:
                booking.warning_task_id = None
            
            if payout_eta > now:
                payout_res = auto_complete_booking.apply_async(
                    args=[booking.id], 
                    eta=payout_eta
                )
                booking.payout_task_id = payout_res.id
            else:
                booking.payout_task_id = None

            booking.save(update_fields=['reminder_task_id', 'warning_task_id', 'payout_task_id'])

    def perform_create(self, serializer):
        with transaction.atomic():
            booking = serializer.save(customer=self.request.user)
            booking_id = booking.id
            
            vendor_user = booking.get_vendor_user
            if not vendor_user:
                print("[-] Integrity Error: Target vendor could not be resolved.")
                return 

            vendor_id_str = str(vendor_user.id)
            customer_id_str = str(self.request.user.id)

            transaction.on_commit(lambda: send_booking_notifications.delay(booking_id))
            transaction.on_commit(lambda: create_and_send_notification.delay(
                recipient_id=vendor_id_str, actor_id=customer_id_str,
                verb="booked", target_model_name="Booking", target_id=booking_id
            ))

            if booking.status == "confirmed":
                transaction.on_commit(lambda: self.schedule_booking_automation_tasks(booking))

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        vendor_user = booking.get_vendor_user
        is_vendor = vendor_user and (str(request.user.id) == str(vendor_user.id))

        if booking.status in ["cancelled", "completed"]:
            return Response({"detail": "This booking cannot be altered in its current state."}, status=400)

        if getattr(booking, 'is_paid', False) or booking.status == "confirmed":
            if not is_vendor:
                return Response(
                    {"detail": "Paid appointments cannot be cancelled. You can reschedule your appointment up to 24 hours prior."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        with transaction.atomic():
            booking.status = "cancelled"
            booking.save(update_fields=["status"])
            
            wallet = booking.get_vendor_wallet
            amount = booking.vendor_payout_amount
            wallet.pending_balance -= amount
            wallet.save()

            Transaction.objects.create(
                wallet=wallet, amount=amount, tx_type='refund',
                status='completed', booking_id=booking.id, tx_ref=f"REFUND-{booking.id}"
            )

            old_task_ids = [booking.reminder_task_id, booking.warning_task_id, booking.payout_task_id]
            for task_id in old_task_ids:
                if task_id:
                    transaction.on_commit(lambda tid=task_id: current_app.control.revoke(tid, terminate=True))

            if not vendor_user:
                return Response({"detail": "Cancellation processed without notification sync."}, status=200)

            recipient_id = str(booking.customer.id) if is_vendor else str(vendor_user.id)

            transaction.on_commit(lambda: create_and_send_notification.delay(
                recipient_id=recipient_id, actor_id=str(request.user.id),
                verb="cancelled", target_model_name="Booking", target_id=booking.id
            ))

        return Response({"detail": "Booking cancelled cleanly."}, status=200)

    @extend_schema(
        request=BookingRescheduleSerializer,
        responses={200: BookingRescheduleSerializer}
    )
    @action(detail=True, methods=["post"], url_path='reschedule')
    def reschedule(self, request, pk=None):
        """
        Updates appointment timeline parameters and recalculates active Celery task distributions.
        """
        booking = self.get_object()
        
        if booking.status not in ["confirmed", "pending"]:
            return Response({"detail": "Inactive bookings cannot be modified."}, status=400)

        vendor_user = booking.get_vendor_user
        is_vendor = vendor_user and (str(request.user.id) == str(vendor_user.id))
        
        # 24-hour Lockout Enforcement
        if not is_vendor:
            current_now = timezone.now()
            naive_booking_dt = datetime.combine(booking.date, booking.start_time)
            
            # Use active timezone to evaluate lockout safely
            booking_datetime = timezone.make_aware(naive_booking_dt, timezone.get_current_timezone())
            
            lockout_threshold = current_now + timedelta(hours=24)
            if booking_datetime < lockout_threshold:
                return Response(
                    {"detail": "This appointment is less than 24 hours away and can no longer be rescheduled online."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = BookingRescheduleSerializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            # Commit mutations directly to DB
            updated_booking = serializer.save()
            
            recipient_id = str(booking.customer.id) if is_vendor else str(vendor_user.id)
            
            transaction.on_commit(lambda: create_and_send_notification.delay(
                recipient_id=recipient_id, actor_id=str(request.user.id),
                verb="rescheduled", target_model_name="Booking", target_id=updated_booking.id
            ))
            
            # Immediately schedule fresh tasks with the newly saved datetimes
            if updated_booking.status == "confirmed":
                transaction.on_commit(lambda: self.schedule_booking_automation_tasks(updated_booking))
            else:
                # If pending, just revoke the old scheduled tasks completely
                old_task_ids = [updated_booking.reminder_task_id, updated_booking.warning_task_id, updated_booking.payout_task_id]
                for task_id in old_task_ids:
                    if task_id:
                        transaction.on_commit(lambda tid=task_id: current_app.control.revoke(tid, terminate=True))

        return Response({"detail": "Appointment successfully rescheduled.", "data": serializer.data}, status=200)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        booking = self.get_object()
        if booking.status != "confirmed":
            return Response({"detail": "Only confirmed bookings can be finalized."}, status=400)

        try:
            with transaction.atomic():
                booking.status = "completed"
                booking.save(update_fields=["status"])

                wallet = booking.get_vendor_wallet
                amount = booking.vendor_payout_amount

                wallet.pending_balance -= amount
                wallet.available_balance += amount
                wallet.save()

                Transaction.objects.create(
                    wallet=wallet, amount=amount, tx_type='payout_release',
                    status='completed', booking_id=booking.id, tx_ref=f"RELEASE-{booking.id}"
                )
                
                transaction.on_commit(lambda: create_and_send_notification.delay(
                    recipient_id=str(booking.customer.id), actor_id=str(request.user.id),
                    verb="completed", target_model_name="Booking", target_id=booking.id
                ))
                
            return Response({"detail": "Booking finalized and payout moved to available balance."}, status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)
        
    @action(detail=True, methods=['get'], url_path='status')
    def get_status(self, request, pk=None):
        booking = self.get_object()
        return Response({
            "id": booking.id,
            "status": booking.status,
            "payment_reference": booking.payment_reference
        })



class VerifyNINView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(
    request=VerifyNinSerializer,
    responses={200: None}
    )
    def post(self, request):
        serializer = VerifyNinSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        nin = serializer.validated_data["vnin"]
        is_verified, reason = verify_nin(nin, self.request.user)
        if not is_verified:
                return Response({"error": reason}, status=400)
        return Response({"success" : "NIN verified succesfully"})


  