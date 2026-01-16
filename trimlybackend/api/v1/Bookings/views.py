from api.v1.Payments.models import Transaction
from .serializers import BookingSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import  permissions
from api.v1.Users.permissions import IsBookingOwnerOrProvider , BookingActionPermission
from .models import Booking
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .serializers import BookingSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

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
            return Booking.objects.all()

        if user.role == "salon_owner":
            return Booking.objects.filter(
                salon_service__salon__owner=user
            )

        if user.role == "individual_vendor":
            return Booking.objects.filter(
                vendor_service__vendor__worker=user
            )

        return Booking.objects.filter(customer=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        booking = self.get_object()

        if booking.status != "pending":
            return Response(
                {"detail": "Only pending bookings can be confirmed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "confirmed"
        booking.save(update_fields=["status"])

        return Response(
            {"detail": "Booking confirmed."},
            status=status.HTTP_200_OK
        )

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
            status=status.HTTP_200_OK
        )


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