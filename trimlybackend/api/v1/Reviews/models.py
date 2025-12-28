from django.db import models
import uuid
from api.v1.Users.models import User
from api.v1.Salons.models import SalonProfile
from api.v1.Vendor.models import IndividualVendorProfile

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_written")
    rating = models.PositiveIntegerField(default=0)
    review = models.TextField(null=True, blank=True)
    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE, related_name="reviews", null=True, blank=True)
    vendor = models.ForeignKey(IndividualVendorProfile, on_delete=models.CASCADE, related_name="reviews", null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)