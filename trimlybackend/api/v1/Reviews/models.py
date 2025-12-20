from django.db import models
import uuid
from api.v1.Users.models import User
from api.v1.Salons.models import SalonProfile

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    review = models.TextField()

    salon = models.ForeignKey(SalonProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)