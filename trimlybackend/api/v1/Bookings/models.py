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

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("confirmed", "Confirmed"),
            ("cancelled", "Cancelled"),
            ("cancelled", "Cancelled"),
        ],
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Booking {self.id} - {self.customer}"

    # 🔑 Resolve provider dynamically
    