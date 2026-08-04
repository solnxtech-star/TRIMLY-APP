from django.db import models
from api.v1.Salons.models import SalonServices,  SalonProfile
from api.v1.Vendor.models import VendorServices
from api.v1.Users.models import User
from django.core.exceptions import ValidationError
import uuid
from django.db.models import Q
from datetime import datetime, timedelta

from api.v1.Category.models import Availability



class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bookings"
    )

    salon_service = models.ForeignKey(
        SalonServices,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="bookings",
    )

    vendor_service = models.ForeignKey(
        VendorServices,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="bookings",
    )

    date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    payment_reference = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("confirmed", "Confirmed"),
            ("completed", "Completed"),
            ("cancelled", "Cancelled"),
        ],
        default="pending",db_index=True
    )
    vendor_payout_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_rated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    # Storage for scheduled Celery task tracking IDs (used for revocation on reschedule/cancellation)
    reminder_task_id = models.CharField(max_length=255, null=True, blank=True)
    warning_task_id = models.CharField(max_length=255, null=True, blank=True)
    payout_task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def get_vendor_user(self):
        """Returns the User object of the person providing the service"""
        if self.vendor_service:
            return self.vendor_service.vendor.worker
        return self.salon_service.salon.owner
    @property
    def get_vendor_wallet(self):
        """Returns the Wallet of the barber or salon owner"""
        vendor_user = self.get_vendor_user
        return vendor_user.wallet 
    @property
    def total_service_price(self): # Rename this so it's not confusing
        if self.vendor_service:
            return self.vendor_service.price
        return self.salon_service.price
    @property
    def get_vendor_service_name(self):
        if self.vendor_service:
            return self.vendor_service.name
        return self.salon_service.name
    from datetime import datetime

# Inside your Booking model class
    @property
    def appointment_datetime(self):
        """Combines date and start_time into a single datetime object for timers"""
        if self.date and self.start_time:
            return datetime.combine(self.date, self.start_time)
        return None

    def __str__(self):
        return f"Booking {self.id} - {self.customer}"

    # 🔑 Resolve provider dynamically
    
from django.db import models

class SystemSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "system_settings"

    def __str__(self):
        return f"{self.key}: {self.value}"