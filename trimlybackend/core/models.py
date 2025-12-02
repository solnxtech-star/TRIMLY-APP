from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('individual_vendor', 'Individual Vendor'),
        ('salon_owner', 'Salon Owner'),
    ]

    role = models.CharField(max_length=30, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=20, unique=True)
    otp = models.DecimalField(max_digits=6, decimal_places=0, null=True, blank=True)

    # Remove username field if you want to use email as username
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']   # or [] if you don’t want username at all

    def __str__(self):
        return f"{self.email} ({self.role})"


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ServiceCategory(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Gallery(models.Model):
    image = models.ImageField(upload_to='gallery/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id}"

class SalonProfile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    specialist = models.ForeignKey("SalonStaff", null=True, blank=True, on_delete=models.SET_NULL)
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)

    about = models.TextField(null=True, blank=True)
    address = models.CharField(max_length=255)
    latitude = models.CharField(max_length=100)
    longitude = models.CharField(max_length=100)

    profile_pic = models.ImageField(upload_to='salon_profiles/', null=True, blank=True)

    salon_services = models.ManyToManyField("SalonServices", blank=True)
    salon_packages = models.ManyToManyField("SalonPackages", blank=True)
    portfolio = models.ManyToManyField(Gallery, blank=True)

    links = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class SalonStaff(models.Model):
    name = models.CharField(max_length=255)
    service_category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE)

    image = models.ImageField(upload_to='staff/', null=True)
    experience = models.IntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class SalonServices(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class SalonPackages(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    sample_image = models.ImageField(upload_to='packages/', null=True)
    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)

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

class Availability(models.Model):
    individual_vendor = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    salon = models.ForeignKey(SalonProfile, null=True, blank=True, on_delete=models.CASCADE)

    day_of_week = models.IntegerField()  # 0-6
    start_time = models.TimeField()
    end_time = models.TimeField()

class Review(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    review = models.TextField()

    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Conversation(models.Model):
    customer = models.ForeignKey(User, related_name="customer_conversations", on_delete=models.CASCADE)
    vendor = models.ForeignKey(User, related_name="vendor_conversations", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)

    text = models.TextField(blank=True)
    image = models.ImageField(upload_to='messages/', null=True, blank=True)

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Booking(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)

    service = models.ManyToManyField(SalonServices, blank=True)
    package = models.ManyToManyField(SalonPackages, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True)

    appointment_date = models.DateTimeField()
    salon = models.ForeignKey(SalonProfile, null=True, blank=True, on_delete=models.SET_NULL)
    vendor = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=255, unique=True)
    provider = models.CharField(max_length=50)
    status = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)

