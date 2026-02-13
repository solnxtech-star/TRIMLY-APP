from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Booking
from django.db import connections
#change to celery beat rather than ete, to cancle appointment reminders
#change eta time to use 2hrs


@shared_task
def send_booking_notifications(booking_id):
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