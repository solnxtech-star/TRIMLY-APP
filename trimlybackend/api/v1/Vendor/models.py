from django.db import models

from api.v1.Category.models import Gallery, ServiceCategory
from api.v1.Users.models import User

class IndividualVendorProfile(models.Model):
    worker = models.OneToOneField(User, on_delete=models.CASCADE)
    service_category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    date_of_birth = models.DateTimeField(auto_now_add=True)
    bio = models.TextField()
    profile_pic = models.ImageField(upload_to='vendors/', null=True)
    years_of_experience = models.IntegerField()
    Gender = models.CharField(max_length=10, choices=[('male', 'male'), ('female', 'female')], default='male')
    total_earnings = models.BigIntegerField(default=0)
    portfolio = models.ForeignKey(Gallery, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.worker.email

class VendorServices(models.Model):

    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vendor_services")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration_minutes = models.PositiveIntegerField(default=10)
    categories = models.ManyToManyField(ServiceCategory)

    def __str__(self):
        return f"{self.vendor.email} - {self.name}"
