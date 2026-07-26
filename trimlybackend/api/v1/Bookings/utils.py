import logging
from datetime import datetime, timedelta
import requests

from django.conf import settings
from django.db import models
from django.utils import timezone

from api.v1.Category.models import Availability, AvailabilityException
from api.v1.Salons.models import SalonProfile
from api.v1.Vendor.models import IndividualVendorProfile
from .models import Booking

logger = logging.getLogger(__name__)


# ==========================================
# 1. SLOT GENERATION UTILITY
# ==========================================

def get_available_slots(provider, date, service_duration):
    """
    Returns a list of available time slots for a specific vendor/salon on a given date.
    """
    weekday = date.weekday()

    # Setup provider-specific filter keys
    if isinstance(provider, SalonProfile):
        lookup = {'salon': provider}
        booking_q = models.Q(salon_service__salon=provider)
    elif isinstance(provider, IndividualVendorProfile):
        lookup = {'vendor': provider}
        booking_q = models.Q(vendor_service__vendor=provider)
    else:
        return []

    # Check general availability rules
    avail = Availability.objects.filter(day_of_week=weekday, **lookup).first()
    if not avail:
        return []

    # Check for Exceptions (e.g., Holiday or modified hours)
    exception = AvailabilityException.objects.filter(date=date, **lookup).first()
    if exception:
        if not exception.is_available:
            return []
        start_time, end_time = exception.start_time, exception.end_time
    else:
        start_time, end_time = avail.start_time, avail.end_time

    # Fetch existing active bookings
    existing_bookings = Booking.objects.filter(
        date=date,
        status__in=['pending', 'confirmed']
    ).filter(booking_q)

    slots = []
    current_time = datetime.combine(date, start_time)
    end_datetime = datetime.combine(date, end_time)
    
    interval = 30  # Step interval in minutes
    now_local = timezone.localtime()
    today_local = now_local.date()

    while current_time + timedelta(minutes=service_duration) <= end_datetime:
        slot_start_dt = current_time
        slot_end_dt = current_time + timedelta(minutes=service_duration)

        # Skip slots that are already in the past if checking for today
        if date == today_local and slot_start_dt < now_local.replace(tzinfo=None):
            current_time += timedelta(minutes=interval)
            continue

        slot_start_time = slot_start_dt.time()
        slot_end_time = slot_end_dt.time()

        # Check overlap with existing bookings
        is_blocked = False
        for booking in existing_bookings:
            # Overlap formula: (StartA < EndB) AND (EndA > StartB)
            if slot_start_time < booking.end_time and slot_end_time > booking.start_time:
                is_blocked = True
                break

        if not is_blocked:
            slots.append({
                "start": slot_start_time.strftime("%H:%M"),
                "end": slot_end_time.strftime("%H:%M")
            })

        current_time += timedelta(minutes=interval)

    return slots


# ==========================================
# 2. DOJAH NIN VERIFICATION UTILITY
# ==========================================

IS_PROD = getattr(settings, "DOJAH_ENVIRONMENT", "sandbox") == "production"
DOJAH_BASE_URL = "https://api.dojah.io" if IS_PROD else "https://sandbox.dojah.io"

DOJAH_APP_ID = getattr(settings, "DOJAH_APP_ID", "")
DOJAH_SECRET_KEY = getattr(settings, "DOJAH_SECRET_KEY", "")


def verify_standard_nin(nin_code: str):
    """
    Verifies an 11-digit NIN via Dojah API with terminal logging.
    """
    url = f"{DOJAH_BASE_URL}/api/v1/kyc/nin"

    # Terminal Log: Environment Check
    env_label = "PRODUCTION 🔴" if IS_PROD else "SANDBOX/TEST 🟡"
    print(f"\n[DOJAH NIN CHECK] Environment: {env_label}")
    print(f"[DOJAH NIN CHECK] Hitting Target URL: {url}")
    print(f"[DOJAH NIN CHECK] App ID: {DOJAH_APP_ID[:6]}... (hidden)")

    headers = {
        "AppId": DOJAH_APP_ID,
        "Authorization": DOJAH_SECRET_KEY,
        "Accept": "application/json",
    }

    params = {"nin": nin_code}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)

        # Terminal Log: Response Debugging
        print(f"[DOJAH NIN CHECK] Status Code: {response.status_code}")
        print(f"[DOJAH NIN CHECK] Raw Response: {response.text}\n")

        if response.status_code == 200:
            data = response.json()
            entity = data.get("entity", {})
            return True, entity

        error_payload = response.json()
        error_msg = error_payload.get("error") or "Failed to verify NIN with Dojah."
        logger.error(f"Dojah NIN Verification Error: {error_payload}")
        return False, error_msg

    except requests.exceptions.Timeout:
        print("[DOJAH NIN CHECK] Error: Request timed out.")
        logger.error("Dojah API request timed out.")
        return False, "Verification service timed out. Please try again."

    except requests.exceptions.RequestException as e:
        print(f"[DOJAH NIN CHECK] Request Exception: {e}")
        logger.error(f"Dojah API Exception: {str(e)}")
        return False, "Unable to reach verification service at this time."
    
import re
from django.utils import timezone

def verify_nin(nin_code: str, user):
    # 1. Guard Role Access
    if user.role != "individual_vendor":
        return False, "Only individual vendors can perform NIN verification."

    # 2. Check Local Database First (Prevents duplicate paid API calls)
    try:
        profile = user.individual_vendor_profile
    except AttributeError:
        return False, "Vendor profile not found."

    if profile.is_nin_verified:
        return False, "Your NIN is already verified."

    # 3. Local Format Validation (Prevents bad inputs hitting Dojah)
    nin_code = nin_code.strip()
    if not re.match(r"^\d{11}$", nin_code):
        return False, "Invalid NIN format. Must be exactly 11 digits."

    # 4. Hit Dojah API (Only called if all local checks pass)
    success, data_or_reason = verify_standard_nin(nin_code)

    if not success:
        return False, data_or_reason

    # 5. Persist Verified State
    profile.is_nin_verified = True
    profile.nin_verified_at = timezone.now()
    profile.save(update_fields=["is_nin_verified", "nin_verified_at"])

    return True, "NIN verified successfully."