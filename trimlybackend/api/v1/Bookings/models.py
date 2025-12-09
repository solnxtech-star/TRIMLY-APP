from django.db import models
from api.v1.Salons.models import SalonServices,  SalonProfile
from api.v1.Users.models import User
class Booking(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="customer_bookings")

    service = models.ManyToManyField(SalonServices, blank=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True)

    appointment_date = models.DateTimeField()
    salon = models.ForeignKey(SalonProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name="salon_bookings")
    vendor = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="vendor_bookings")

    created_at = models.DateTimeField(auto_now_add=True)

class Availability(models.Model):
    individual_vendor = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE, related_name="vendor_availaibility")
    salon = models.ForeignKey(SalonProfile, null=True, blank=True, on_delete=models.CASCADE, related_name="salon_availaibility")

    day_of_week = models.IntegerField()  # 0-6
    start_time = models.TimeField()
    end_time = models.TimeField()