from django.db import models
from api.v1.Salons.models import SalonServices,  SalonProfile
from api.v1.Vendor.models import VendorServices
from api.v1.Users.models import User
import uuid
class Booking(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = ("PENDING", "pending")
        CONFIRMED = ("CONFIRMED", "confirmed")
        CANCELLED = ("CANCELLED", "cancelled")
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="customer_bookings")
    salon_service = models.ForeignKey(SalonServices,null=True, blank=True, on_delete=models.CASCADE)
    vendor_service = models.ForeignKey(VendorServices, null=True, blank=True, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    notes = models.TextField(blank=True)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}"

class Availability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)

    individual_vendor = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE, related_name="vendor_availaibility")
    salon = models.ForeignKey(SalonProfile, null=True, blank=True, on_delete=models.CASCADE, related_name="salon_availaibility")

    day_of_week = models.IntegerField()  # 0-6
    start_time = models.TimeField()
    end_time = models.TimeField()
    def __str__(self):
        return f"{self.id}"