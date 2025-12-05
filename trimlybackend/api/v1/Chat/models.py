from django.db import models

from api.v1.Users.models import User

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