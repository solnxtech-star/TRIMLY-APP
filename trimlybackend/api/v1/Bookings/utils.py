from datetime import datetime, timedelta
from api.v1.Category.models import Availability, AvailabilityException
from .models import Booking
from django.db import models


def get_available_slots(provider, date, service_duration):
    """
    Returns a list of available time slots for a specific vendor on a specific date.
    """
    # 1. Get the weekday (0=Monday, 6=Sunday)
    weekday = date.weekday()

    # 2. Check general availability rules for this day
    avail = Availability.objects.filter(salon=provider, day_of_week=weekday).first()
    if not avail:
        return [] # Not working this day

    # 3. Check for Exceptions (e.g., Holiday or changed hours)
    exception = AvailabilityException.objects.filter(salon=provider, date=date).first()
    
    if exception:
        if not exception.is_available:
            return [] # Vendor took the day off
        start_time = exception.start_time
        end_time = exception.end_time
    else:
        start_time = avail.start_time
        end_time = avail.end_time

    # 4. Fetch existing bookings for this day
    existing_bookings = Booking.objects.filter(
        date=date,
        status__in=['pending', 'confirmed']
    ).filter(
        # This handles your dynamic provider logic
        models.Q(salon_service__salon=provider) | models.Q(vendor_service__vendor=provider)
    )

    # 5. Generate Potential Slots (e.g., every 30 minutes)
    slots = []
    current_time = datetime.combine(date, start_time)
    end_datetime = datetime.combine(date, end_time)
    
    # Assuming we check slots in 30-minute intervals
    interval = 30 

    while current_time + timedelta(minutes=service_duration) <= end_datetime:
        slot_start = current_time.time()
        slot_end = (current_time + timedelta(minutes=service_duration)).time()
        
        # 6. Check if this specific slot overlaps with any existing booking
        is_blocked = False
        for booking in existing_bookings:
            # Overlap logic: (StartA < EndB) AND (EndA > StartB)
            if slot_start < booking.end_time and slot_end > booking.start_time:
                is_blocked = True
                break
        
        if not is_blocked:
            slots.append({
                "start": slot_start.strftime("%H:%M"),
                "end": slot_end.strftime("%H:%M")
            })
        
        # Move to the next potential start time
        current_time += timedelta(minutes=interval)

    return slots