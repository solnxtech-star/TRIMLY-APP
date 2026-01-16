from django.db import models
from cloudinary.models import CloudinaryField
from api.v1.Category.models import Gallery, ServiceCategory
from api.v1.Users.models import User
import uuid
class IndividualVendorProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    worker = models.OneToOneField(User, on_delete=models.CASCADE, related_name="individual_vendor_profile")
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    date_of_birth = models.DateTimeField(auto_now_add=True)
    bio = models.TextField()
    profile_pic = CloudinaryField('image', folder='profile_pic/vendors', overwrite=True, resource_type="image", null=True, blank = True)
    years_of_experience = models.IntegerField()
    Gender = models.CharField(max_length=10, choices=[('male', 'male'), ('female', 'female')], default='male')
    latitude = models.DecimalField(max_digits=22, decimal_places=16, null=True, blank=True)
    # Longitude: ranges from -180 to 180
    longitude = models.DecimalField(max_digits=22, decimal_places=16, null=True, blank=True )
    address = models.CharField(max_length=255, null=True, blank=True)
    flw_subaccount_id = models.CharField(max_length=40, null=True, blank=True)
    bank_code = models.CharField(max_length=15, null=True, blank=True)
    account_number = models.CharField(max_length=15, null=True, blank=True)
    total_earnings = models.BigIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)


    def __str__(self):
        return self.worker.email

class VendorServices(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vendor = models.ForeignKey(IndividualVendorProfile, on_delete=models.CASCADE, related_name="vendor_services")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration_minutes = models.PositiveIntegerField(default=10)
    categories = models.ManyToManyField(ServiceCategory)

    def __str__(self):
        return f"{self.vendor.email} - {self.name}"
