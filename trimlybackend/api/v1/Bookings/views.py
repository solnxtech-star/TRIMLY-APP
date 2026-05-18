from api.v1.Payments.models import Transaction
from .serializers import BookingSerializer
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



class BookingViewSet(ModelViewSet):
    """
    Handles bookings for all users (salon, vendors, users)
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

    def perform_create(self, serializer):
        with transaction.atomic():
            booking = serializer.save(customer=self.request.user)
            booking_id = booking.id
            
            vendor_user = booking.get_vendor_user
            if not vendor_user:
                print("ERROR: No vendor found for this booking")
                return 

            vendor_id_str = str(vendor_user.id)
            customer_id_str = str(self.request.user.id)

            # 1. IMMEDIATE: Emails
            transaction.on_commit(lambda: send_booking_notifications.delay(booking_id))
            
            # 2. IMMEDIATE: WebSocket Notification (To Vendor)
            transaction.on_commit(lambda: create_and_send_notification.delay(
                recipient_id=vendor_id_str,
                actor_id=customer_id_str,
                verb="booked",
                target_model_name="Booking",
                target_id=booking_id
            ))

            # 3. SCHEDULING: The Algorithm
            appt_time = booking.appointment_datetime
            reminder_eta = booking.created_at + timedelta(minutes=1)
            payout_eta = appt_time + timedelta(hours=24)
            warning_eta = payout_eta - timedelta(hours=2)

            vendor_email = booking.vendor_service.vendor.worker.email if booking.vendor_service else booking.salon_service.salon.owner.email
            
            send_reminder_task.apply_async(
                args=[booking.customer.email, vendor_email, booking.customer.username, booking.date, booking.start_time],
                eta=reminder_eta
            )

            warn_customer_of_autocomplete.apply_async(args=[booking_id], eta=warning_eta)
            auto_complete_booking.apply_async(args=[booking_id], eta=payout_eta)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status in ["cancelled", "completed"]:
            return Response({"detail": "This booking cannot be cancelled."}, status=400)

        with transaction.atomic():
            booking.status = "cancelled"
            booking.save(update_fields=["status"])
            
            # 1. Handle the Wallet Rollbacks
            wallet = booking.get_vendor_wallet
            amount = booking.vendor_payout_amount
            wallet.pending_balance -= amount
            wallet.save()

            # 2. Record the Refund Transaction Log
            Transaction.objects.create(
                wallet=wallet, amount=amount, tx_type='refund',
                status='completed', booking_id=booking.id, tx_ref=f"REFUND-{booking.id}"
            )

            # 3. Securely Fetch Vendor User
            vendor_user = booking.get_vendor_user
            if not vendor_user:
                return Response({"detail": "Booking cancellation processed, but target vendor account could not be resolved for notifications."}, status=200)

            # 4. EXPLANATION OF NOTIFICATION ROUTING LOGIC:
            # We compare standard strings of the primary keys (IDs).
            # If the ID of the person making this API request matches the Vendor's ID, 
            # the Vendor is the one cancelling, so we route the notification to the Customer.
            # Otherwise, the Customer is cancelling, so we route it to the Vendor.
            if str(request.user.id) == str(vendor_user.id):
                recipient_id = str(booking.customer.id)
            else:
                recipient_id = str(vendor_user.id)

            # 5. Broadcast via WebSocket once DB transaction is completely safely saved
            transaction.on_commit(lambda: create_and_send_notification.delay(
                recipient_id=recipient_id,
                actor_id=str(request.user.id),
                verb="cancelled",
                target_model_name="Booking",
                target_id=booking.id
            ))

        return Response({"detail": "Booking cancelled and refund initiated."}, status=200)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        booking = self.get_object()
        if booking.status != "confirmed":
            return Response({"detail": "Only confirmed bookings can be completed."}, status=400)

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
                
                # Completion is usually marked by the Vendor or Autocomplete system.
                # The customer needs to receive this confirmation notification.
                transaction.on_commit(lambda: create_and_send_notification.delay(
                    recipient_id=str(booking.customer.id),
                    actor_id=str(request.user.id),
                    verb="completed",
                    target_model_name="Booking",
                    target_id=booking.id
                ))
                
            return Response({"detail": "Booking completed and funds released."}, status=200)
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


  