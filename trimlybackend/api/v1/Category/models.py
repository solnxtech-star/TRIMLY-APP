import uuid
from django.db import models
from django.core.exceptions import ValidationError

class ServiceCategory(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Gallery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to='gallery/')
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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    salon = models.ForeignKey(
        "Salons.SalonProfile",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="availabilities"
    )
    vendor = models.ForeignKey(
        "Vendor.IndividualVendorProfile",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="availabilities"
    )

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["date"]),
        ]

    def clean(self):
        # 1️⃣ Must have exactly one provider
        if not self.salon and not self.vendor:
            raise ValidationError("Availability must belong to a salon or a vendor.")

        if self.salon and self.vendor:
            raise ValidationError("Availability cannot belong to both salon and vendor.")

        # 2️⃣ Time logic
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time.")

        # 3️⃣ Overlap detection
        qs = Availability.objects.filter(date=self.date)

        if self.salon:
            qs = qs.filter(salon=self.salon)
        else:
            qs = qs.filter(vendor=self.vendor)

        if self.pk:
            qs = qs.exclude(pk=self.pk)

        overlap_exists = qs.filter(
            start_time__lt=self.end_time,
            end_time__gt=self.start_time,
        ).exists()

        if overlap_exists:
            raise ValidationError("This availability overlaps with an existing one.")

    def save(self, *args, **kwargs):
        self.full_clean()  # 🔒 enforces clean()
        super().save(*args, **kwargs)

        

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

    def clean(self):
        if self.salon and self.vendor:
            raise ValidationError("Exception cannot belong to both salon and vendor.")

        if not self.salon and not self.vendor:
            raise ValidationError("Exception must belong to salon or vendor.")

        if self.is_available:
            if not self.start_time or not self.end_time:
                raise ValidationError("Start and end time required when available.")
            if self.start_time >= self.end_time:
                raise ValidationError("Invalid time range.")
