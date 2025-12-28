import uuid
from django.db import models
from cloudinary.models import CloudinaryField
from django.core.exceptions import ValidationError

class ServiceCategory(models.Model):
    
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Gallery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = CloudinaryField('image', folder='gallery/', overwrite=True, resource_type="image")
    salon = models.ForeignKey('Salons.SalonProfile', related_name="salon_portfolio", on_delete=models.CASCADE, null=True, blank=True)
    vendor = models.ForeignKey('Vendor.IndividualVendorProfile', related_name = "vendor_portfolio", null=True, blank=True, on_delete=models.CASCADE)
    caption = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # exactly ONE must be set
        if not self.salon and not self.vendor:
            raise ValidationError("Gallery must belong to a salon or a vendor")
        if self.salon and self.vendor:
            raise ValidationError("Gallery cannot belong to both salon and vendor")

    def __str__(self):
        return f"Image {self.id}"


class Availability(models.Model):
    DAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    salon = models.ForeignKey('Salons.SalonProfile', on_delete=models.CASCADE, null=True, blank=True, related_name="availabilities")
    vendor = models.ForeignKey('Vendor.IndividualVendorProfile', on_delete=models.CASCADE, null=True, blank=True, related_name = "availabilities")
    day_of_week = models.IntegerField(choices=DAY_CHOICES, default=0)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        # This ensures a salon/vendor doesn't have two overlapping "Monday" schedules
        verbose_name_plural = "Availabilities"

    def __str__(self):
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        day_name = days[self.day_of_week] if 0 <= self.day_of_week <= 6 else self.day_of_week
        entity = self.salon.name if self.salon else self.vendor.worker.get_full_name()
        return f"{entity} | {day_name}"
        

class AvailabilityException(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    salon = models.ForeignKey(
        "Salons.SalonProfile",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="availability_exceptions"
    )
    vendor = models.ForeignKey(
        "Vendor.IndividualVendorProfile",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="availability_exceptions"
    )

    date = models.DateField()
    is_available = models.BooleanField(default=False)

    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    class Meta:
        unique_together = (
            ("salon", "date"),
            ("vendor", "date"),
        )

    def __str__(self):
        entity = self.salon if self.salon else self.vendor
        status = "Available" if self.is_available else "Closed"
        return f"EXCEPTION: {entity} | {self.date} | {status}"