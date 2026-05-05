from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

from api.v1.Notifications.tasks import create_and_send_notification
from api.v1.Payments.models import Transaction
from .models import Booking
from django.db import connections, transaction
#change to celery beat rather than ete, to cancle appointment reminders
#change eta time to use 2hrs

@shared_task(
    bind=True, 
    autoretry_for=(Exception,), 
    retry_backoff=True, # Resend is stable, but always good to have backoff
    max_retries=3
)
def send_booking_notifications(self, booking_id):
    try:
        booking = Booking.objects.select_related('customer', 'salon_service', 'vendor_service').get(id=booking_id)
        
        # 1. Email to Customer
        send_mail(
            "Booking Confirmed!",
            f"Hi {booking.customer.username}, your appointment is set for {booking.date} by {booking.start_time}.",
            settings.DEFAULT_FROM_EMAIL,
            [booking.customer.email]
        )

        # 2. Email to Vendor (Individual or Salon Owner)
        vendor_email = booking.vendor_service.vendor.worker.email if booking.vendor_service else booking.salon_service.salon.owner.email
        send_mail(
            "New Booking Received!",
            f"You have a new appointment with {booking.customer.username} on {booking.date}, by {booking.start_time}.",
            settings.DEFAULT_FROM_EMAIL,
            [vendor_email]
        )
    except Exception as e:
        return str(e)
    connections.close_all()

@shared_task
def send_reminder_task(customer_email,vendor_email, name, date, time):
    send_mail(
        "Appointment Reminder",
        f"Hi {name}, just a reminder about your appointment at {date}, by {time}!",
        settings.DEFAULT_FROM_EMAIL,
        [customer_email]
    )
    send_mail(
        "Upcoming Appointment Reminder",
        f"Friendly reminder: You have an appointment with {name} at {date}, by {time}.",
        settings.DEFAULT_FROM_EMAIL,
        [vendor_email]
    )
    connections.close_all()

@shared_task
def warn_customer_of_autocomplete(booking_id):
    """Algorithm Stage 2: Warning the Customer before Auto-Payout"""
    try:
        booking = Booking.objects.get(id=booking_id)
        if booking.status == "confirmed":
            # In-app Notification
            create_and_send_notification.delay(
                recipient_id=booking.customer.id,
                actor_id=booking.customer.id,
                verb="autocomplete_warning",
                target_model_name="Booking",
                target_id=booking.id
            )
            # Warning Email
            send_mail(
                "Your Booking will Autocomplete Soon",
                f"Hi {booking.customer.username}, your booking will automatically mark as 'Completed' in 2 hours. If you had an issue with the service, please report it now.",
                settings.DEFAULT_FROM_EMAIL,
                [booking.customer.email]
            )
    except Exception as e:
        return str(e)

@shared_task(bind=True, max_retries=3)
def auto_complete_booking(self, booking_id):
    """Algorithm Stage 3: The Final Auto-Payout"""
    try:
        booking = Booking.objects.get(id=booking_id)
        # Crucial: Only pay if the booking is still 'confirmed'
        if booking.status == "confirmed":
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
                    status='completed', booking_id=booking.id, 
                    tx_ref=f"AUTO-RELEASE-{booking.id}"
                )

            # Notify Vendor: Their funds are ready
            vendor_user = booking.get_vendor_user
            create_and_send_notification.delay(
                recipient_id=vendor_user.id,
                actor_id=vendor_user.id,
                verb="payout_cleared",
                target_model_name="Booking",
                target_id=booking.id
            )
    except Exception as e:
        self.retry(exc=e)