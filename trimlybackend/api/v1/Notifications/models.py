from django.db import models
from api.v1.Users.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(User, on_delete=models.CASCADE, null=True) # Who did it
    verb = models.CharField(max_length=255) # e.g., "booked", "canceled", "messaged"
    message = models.CharField(max_length=255, null=True, blank=True)
    
    # Generic Foreign Key setup
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField(null=True)
    target = GenericForeignKey('content_type', 'object_id')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
