import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
import uuid
from datetime import  timedelta
from django.utils import timezone


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
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=False, null=True, blank=True) 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Add fields you REQUIRE at sign up
    objects = CustomUserManager()


    def __str__(self):
        return f"{self.email} ({self.role})"



class OTP(models.Model):
    OTP_TYPES = (
        ('email_verification', 'Email Verification'),
        ('password_reset', 'Password Reset'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    otp_type = models.CharField(max_length=20, choices=OTP_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    @staticmethod
    def generate_code():
        return ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    
    def is_valid(self):

        expiry_time = self.created_at + timedelta(minutes=5)
        return not self.is_used and timezone.now() < expiry_time


