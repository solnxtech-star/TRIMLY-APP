from django.db import models
from api.v1.Category.models import ServiceCategory, Gallery
from api.v1.Users.models import User


class SalonProfile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)

    about = models.TextField(null=True, blank=True)
    address = models.CharField(max_length=255)
    latitude = models.CharField(max_length=100)
    longitude = models.CharField(max_length=100)

    profile_pic = models.ImageField(upload_to='salon_profiles/', null=True, blank=True)

    
    portfolio = models.ManyToManyField(Gallery, blank=True)

    links = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class SalonOwnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='owners/', blank=True)
    address = models.CharField(max_length=255)
    date_of_birth = models.DateTimeField(auto_now_add=True)
    Gender = models.CharField(max_length=10, choices=[('male', 'male'), ('female', 'female')])
    def __str__(self):
        return self.user.name
    

class SalonStaff(models.Model):
    name = models.CharField(max_length=255)
    service_category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE, related_name='salon_staff')

    image = models.ImageField(upload_to='staff/', null=True)
    experience = models.IntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class SalonServices(models.Model):

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
    

