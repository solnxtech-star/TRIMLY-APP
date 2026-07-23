import logging
from celery import shared_task, current_app
from django.core.mail import send_mail
from django.conf import settings
from django.db import connections, transaction

from api.v1.Notifications.tasks import create_and_send_notification
from api.v1.Payments.models import Transaction
from .models import Booking
from django.utils import timezone
from datetime import timedelta

logger = logging.getLogger(__name__)

@shared_task(
    bind=True, 
    autoretry_for=(Exception,), 
    retry_backoff=True, 
    max_retries=3
)
def send_booking_notifications(self, booking_id):
    """
    Fires real-time customer and vendor emails immediately after an escrow creation.
    """
    try:
        booking = Booking.objects.select_related('customer', 'salon_service', 'vendor_service').get(id=booking_id)
        
        # 1. Email to Customer
        send_mail(
            "Booking Confirmed!",
            f"Hi {booking.customer.username}, your appointment is set for {booking.date} at {booking.start_time}.",
            settings.DEFAULT_FROM_EMAIL,
            [booking.customer.email],
            fail_silently=False
        )

        # 2. Email to Vendor (Individual or Salon Owner)
        vendor_email = booking.vendor_service.vendor.worker.email if booking.vendor_service else booking.salon_service.salon.owner.email
        send_mail(
            "New Booking Received!",
            f"You have a new appointment with {booking.customer.username} on {booking.date} at {booking.start_time}.",
            settings.DEFAULT_FROM_EMAIL,
            [vendor_email],
            fail_silently=False
        )
    except Booking.DoesNotExist:
        logger.error(f"[-] send_booking_notifications failed: Booking {booking_id} not found.")
        return
    except Exception as e:
        logger.error(f"[-] Email Notification failed. Retrying... Error: {e}")
        raise self.retry(exc=e)
    finally:
        connections.close_all()


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=3
)
def send_reminder_task(self, customer_email, vendor_email, name, date, time):
    """
    Scheduled reminder running before the appointment. 
    Revoked dynamically by ID if the booking reschedules.
    """
    try:
        # Send to Customer
        send_mail(
            "Appointment Reminder",
            f"Hi {name}, just a reminder about your upcoming appointment on {date} at {time}!",
            settings.DEFAULT_FROM_EMAIL,
            [customer_email],
            fail_silently=False
        )
        # Send to Vendor
        send_mail(
            "Upcoming Appointment Reminder",
            f"Friendly reminder: You have an appointment with {name} on {date} at {time}.",
            settings.DEFAULT_FROM_EMAIL,
            [vendor_email],
            fail_silently=False
        )
    except Exception as e:
        logger.error(f"[-] send_reminder_task connection error: {e}")
        raise self.retry(exc=e)
    finally:
        connections.close_all()


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=3
)
def warn_customer_of_autocomplete(self, booking_id):
    """
    Algorithm Stage 2: Warns the customer via Email and WebSocket 
    exactly 2 hours before the escrow funds auto-release.
    """
    try:
        booking = Booking.objects.select_related('customer').get(id=booking_id)
        
        # State check protection
        if booking.status == "confirmed":
            # 1. Dispatch WS Push Message via Notification App
            create_and_send_notification.delay(
                recipient_id=str(booking.customer.id),
                actor_id=str(booking.customer.id),
                verb="autocomplete_warning",
                target_model_name="Booking",
                target_id=booking.id
            )
            
            # 2. Dispatch Hard Warning Email
            send_mail(
                "Your Booking will Autocomplete Soon",
                f"Hi {booking.customer.username}, your booking will automatically be marked as 'Completed' in 2 hours. If you had an issue with your service, please report it to support or reschedule now.",
                settings.DEFAULT_FROM_EMAIL,
                [booking.customer.email],
                fail_silently=False
            )
    except Booking.DoesNotExist:
        return
    except Exception as e:
        logger.error(f"[-] warn_customer_of_autocomplete processing fallback: {e}")
        raise self.retry(exc=e)
    finally:
        connections.close_all()


@shared_task(bind=True, max_retries=3)
def auto_complete_booking(self, booking_id):
    """
    Algorithm Stage 3: The Automated Escrow Payout Engine.
    Executes exactly 24 hours post-service to auto-release funds to vendor wallets.
    """
    try:
        booking = Booking.objects.get(id=booking_id)
        
        # Guard Clause: Only clear payment if booking hasn't been altered/cancelled
        if booking.status == "confirmed":

            # --- SAFETY GUARD ---
            # Protects against early completion if this task is ever triggered
            # before its real ETA (e.g. eager mode, broker replay, manual call,
            # clock drift). Only completes if 24hrs have genuinely passed since
            # the appointment.
            appt_dt = booking.appointment_datetime
            if appt_dt:
                if timezone.is_naive(appt_dt):
                    appt_dt = timezone.make_aware(appt_dt, timezone.get_current_timezone())
                if timezone.now() < appt_dt + timedelta(hours=24):
                    logger.info(f"[!] auto_complete_booking called early for {booking_id} — skipping.")
                    return

            with transaction.atomic():
                booking.status = "completed"
                booking.save(update_fields=["status"])

                wallet = booking.get_vendor_wallet
                amount = booking.vendor_payout_amount
                
                # Debit escrow, credit clear balance profiles
                wallet.pending_balance -= amount
                wallet.available_balance += amount
                wallet.save()

                # Generate clean transaction reference traces
                Transaction.objects.create(
                    wallet=wallet, 
                    amount=amount, 
                    tx_type='payout_release',
                    status='completed', 
                    booking_id=booking.id, 
                    tx_ref=f"AUTO-RELEASE-{booking.id}"
                )

            # Notify Vendor over WS that funds are cleared for withdrawal
            vendor_user = booking.get_vendor_user
            if vendor_user:
                create_and_send_notification.delay(
                    recipient_id=str(vendor_user.id),
                    actor_id=str(vendor_user.id),
                    verb="payout_cleared",
                    target_model_name="Booking",
                    target_id=booking.id
                )
    except Booking.DoesNotExist:
        return
    except Exception as e:
        logger.error(f"[-] Critical Auto-Payout exception for Booking {booking_id}: {e}")
        raise self.retry(exc=e, countdown=60)  # Retry in 1 minute if database locks up
    finally:
        connections.close_all()