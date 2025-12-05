from django.db import models
from api.v1.Category.models import ServiceCategory, Gallery
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('individual_vendor', 'Individual Vendor'),
        ('salon_owner', 'Salon Owner'),
        ('admin', 'admin')
    ]

    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default="customer")
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    otp = models.DecimalField(max_digits=6, decimal_places=0, null=True, blank=True)

    email = models.EmailField(unique=True)

    username = models.CharField(max_length=150, unique=False, null=True, blank=True) 
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number', 'first_name', 'last_name'] # Add fields you REQUIRE at sign up
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"



class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    date_of_birth = models.DateTimeField(auto_now_add=True)
    Gender = models.CharField(max_length=10, choices=[('male', 'male'), ('female', 'female')])
    def __str__(self):
        return self.name
    
class IndividualVendorProfile(models.Model):
    worker = models.OneToOneField(User, on_delete=models.CASCADE)
    service_category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)

    bio = models.TextField()
    profile_pic = models.ImageField(upload_to='vendors/', null=True)
    years_of_experience = models.IntegerField()

    total_earnings = models.BigIntegerField(default=0)
    portfolio = models.ForeignKey(Gallery, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.worker.email

