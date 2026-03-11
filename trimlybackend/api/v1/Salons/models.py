from django.db import models
from api.v1.Category.models import ServiceCategory, Gallery
from api.v1.Users.models import User
import uuid
from cloudinary.models import CloudinaryField
from django.contrib.gis.db.models import PointField

class SalonProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    about = models.TextField(null=True, blank=True)
    location = PointField(srid=4326, null=True, blank=True)    
    address = models.CharField(max_length=255, null=True, blank=True)
    profile_pic = CloudinaryField('image', folder='profile_pic/salon_profile', overwrite=True, resource_type="image", null=True, blank = True)
    links = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_open = models.BooleanField(default=True)
    tags = models.CharField(max_length=20, null =True, blank=True)

    def __str__(self):
        return self.name

class SalonOwnerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="salon_owner_profile")
    bio = models.TextField(blank=True)
    flw_subaccount_id = models.CharField(max_length=50, null=True, blank=True)
    bank_code = models.CharField(max_length=15, null=True, blank=True)
    account_number = models.CharField(max_length=15, null=True, blank=True)
    profile_pic = CloudinaryField('image', folder='profile_pic/salon_owner', overwrite=True, resource_type="image", null=True, blank = True)
    address = models.CharField(max_length=255)
    date_of_birth = models.DateTimeField(auto_now_add=True)
    Gender = models.CharField(max_length=10, choices=[('male', 'male'), ('female', 'female')])
    is_nin_verified = models.BooleanField(default=False)
    nin_verified_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.user.name
    

class SalonStaff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    service_category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE, related_name='salon_staff')

    profile_pic = CloudinaryField('image', folder='profile_pic/salon_staff', overwrite=True, resource_type="image", null=True, blank = True)
    experience = models.IntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class SalonServices(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    salon = models.ForeignKey(
        SalonProfile,
        on_delete=models.CASCADE,
        related_name="salon_services"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration_minutes = models.PositiveIntegerField(default=10)
    categories = models.ManyToManyField(ServiceCategory)
    

    def __str__(self):
        return f"{self.salon.name} - {self.name}"