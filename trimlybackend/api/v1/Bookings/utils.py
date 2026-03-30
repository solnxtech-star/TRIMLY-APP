from datetime import datetime, timedelta, timezone
import requests
from api.v1.Category.models import Availability, AvailabilityException
from api.v1.Vendor.models import IndividualVendorProfile
from api.v1.Salons.models import SalonProfile
from .models import Booking
from django.db import models


def get_available_slots(provider, date, service_duration):
    """
    Returns a list of available time slots for a specific vendor on a specific date.
    """
    # 1. Get the weekday (0=Monday, 6=Sunday)
    weekday = date.weekday()
    


# 1. Setup provider-specific filter keys
    if isinstance(provider, SalonProfile):
        lookup = {'salon': provider}
        booking_q = models.Q(salon_service__salon=provider)
    elif isinstance(provider, IndividualVendorProfile):
        lookup = {'vendor': provider}
        booking_q = models.Q(vendor_service__vendor=provider)
    else:
        return [] # Handle unknown provider types safely

    # 2. Check general availability rules
    # The **lookup unpacks to salon=provider or vendor=provider
    avail = Availability.objects.filter(day_of_week=weekday, **lookup).first()
    if not avail:
        return [] 

    # 3. Check for Exceptions (e.g., Holiday or changed hours)
    exception = AvailabilityException.objects.filter(date=date, **lookup).first()

    if exception:
        if not exception.is_available:
            return [] 
        start_time, end_time = exception.start_time, exception.end_time
    else:
        start_time, end_time = avail.start_time, avail.end_time

    # 4. Fetch existing bookings
    existing_bookings = Booking.objects.filter(
        date=date,
        status__in=['pending', 'confirmed']
    ).filter(booking_q)


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



def verify_nin(vnin, user):
    """
    verify user vnin using verifyMe
    """
    #dynamically assign vendor profile based on role

    if user.role == "salon_owner":
        vendor_profile = user.salon_owner_profile
    elif user.role == "individual_vendor":
        vendor_profile = user.individual_vendor_profile
    else:
        return False, "only vendors can verify nin"

    if user.is_nin_verified:
        return False, "already_verified"

    # Defensive validation
    if not vnin or len(vnin) != 16:
        return False, "invalid_nin"

    try:
        url = "https://api.qoreid.com/v1/ng/identities/virtual-nin/"

        headers = {
            'accept': 'text/plain',
            'content-type': 'application/json'
        }
        
        params = {
            "vNIN" : vnin
        }
        body = {
            "firstname" : user.first_name,
            "lastname" : user.last_name,
            "dob" : vendor_profile.date_of_birth,
            "gender" : vendor_profile.Gender
        }
                
        response = requests.post(
            url,
            params=params,
            headers=headers,
            json=body,
            timeout=10
        )

        if response.status_code != 200:
            return False, "provider_error"

        data = response.json()

    except requests.RequestException:
        return False, "network_error"
    #extract the status from the response; status can be : (exact match, partial match(a letter is missing form frist or last name), no match)
    vnin_status = data["summary"]["v_nin_check"]["status"]
    if not vnin_status == "EXACT_MATCH":
        return False, "details does not match"


    # Success
    user.is_nin_verified = True
    user.nin_verified_at = timezone.now()
    user.save(update_fields=["nin_verified", "nin_verified_at"])

    return True, None