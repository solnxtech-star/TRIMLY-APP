from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
import uuid
class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('individual_vendor', 'Individual Vendor'),
        ('salon_owner', 'Salon Owner'),
        ('admin', 'admin')
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default="customer")
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    otp = models.DecimalField(max_digits=6, decimal_places=0, null=True, blank=True)

    email = models.EmailField(unique=True)

    username = models.CharField(max_length=150, unique=False, null=True, blank=True) 
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Add fields you REQUIRE at sign up
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"




