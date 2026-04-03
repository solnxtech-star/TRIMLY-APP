from api.v1.Payments.models import Transaction
from .serializers import BookingSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import  permissions
from api.v1.Users.permissions import IsBookingOwnerOrProvider , BookingActionPermission
from .models import Booking
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .serializers import BookingSerializer, BookingDetailSerializer, VerifyNinSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .tasks import send_booking_notifications, send_reminder_task
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

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
    ]

    filterset_fields = [
        "status",
        "date",
        "salon_service",
        "vendor_service",
    ]

    ordering_fields = ["date", "created_at"]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            queryset = Booking.objects.all()

        elif user.role == "salon_owner":
            queryset =  Booking.objects.filter(
                salon_service__salon__owner=user
            )

        elif user.role == "individual_vendor":
            queryset =  Booking.objects.filter(
                vendor_service__vendor__worker=user
            )

        else:
           queryset =  Booking.objects.filter(customer=user)
        if self.action == 'retrieve':
            queryset = queryset.select_related(
                'customer',
                'salon_service__salon',
                'vendor_service__vendor__worker',
            )
        return queryset


    def perform_create(self, serializer):
        with transaction.atomic():
            booking = serializer.save(customer=self.request.user)
            booking_id = booking.id  # ✅ Capture ID immediately
            
            # Use the captured booking_id variable
            transaction.on_commit(lambda: send_booking_notifications.delay(booking_id))
            # Trigger the notification task
            transaction.on_commit(lambda: create_and_send_notification.delay(
            recipient_id=booking.get_vendor_user, # The Individual Vendor
            actor_id=self.request.user.id,  # The Customer
            verb="booked",
            target_model_name="Booking",
            target_id=booking_id
        ))
        
        # Send reminder (this works because it's outside the lambda)
        reminder_time = booking.created_at + timedelta(minutes=1)
        
        if booking.vendor_service:
            vendor_email = booking.vendor_service.vendor.worker.email
        else:
            vendor_email = booking.salon_service.salon.owner.email
        
        send_reminder_task.apply_async(
            args=[
                booking.customer.email, 
                vendor_email, 
                booking.customer.username, 
                booking.date, 
                booking.start_time
            ],
            eta=reminder_time
        )
    def get_serializer_class(self):
        if self.action in ['complete', 'cancel']:
            return None  # This hides all those unnecessary fields in Swagger/Postman
        # elif self.action == "retrieve":
        #     return BookingDetailSerializer
        else:
            return BookingSerializer


    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status in ["cancelled", "completed"]:
            return Response(
                {"detail": "This booking cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "cancelled"
        booking.save(update_fields=["status"])

        return Response(
            {"detail": "Booking cancelled."},
            status=status.HTTP_200_OK)
        


    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        booking = self.get_object()

        # 1. Validation
        if booking.status != "confirmed":
            return Response(
                {"detail": "Only confirmed bookings can be completed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Financial Logic (The "Money Move")
        try:
            with transaction.atomic():
                # Update Status
                booking.status = "completed"
                booking.save(update_fields=["status"])

                # Release Funds from Pending to Available
                wallet = booking.get_vendor_wallet # Using the helper we discussed
                amount_to_release = booking.vendor_payout_amount # Stored during the Webhook

                wallet.pending_balance -= amount_to_release
                wallet.available_balance += amount_to_release
                wallet.save()

                # Record the move in your Transaction ledger
                Transaction.objects.create(
                    wallet=wallet,
                    amount=amount_to_release,
                    tx_type='payout_release',
                    status='completed',
                    booking_id = booking.id,
                    tx_ref=f"RELEASE-{booking.id}"
                )

            return Response({"detail": "Booking completed and funds released."}, status=status.HTTP_200_OK)

        except Exception as e:
            # If anything fails (like a database error), the status stays 'confirmed'
            return Response({"detail": f"Error releasing funds: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=True, methods=['get'], url_path='status')
    def get_status(self, request, pk=None):
        booking = self.get_object()
        return Response({
            "id": booking.id,
            "status": booking.status,        # e.g., "pending", "confirmed"
                # Assuming you have this BooleanField
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


  