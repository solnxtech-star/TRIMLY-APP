from django.db import models
import uuid
from api.v1.Users.models import User

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    customer = models.ForeignKey(User, related_name="customer_conversations", on_delete=models.CASCADE)
    vendor = models.ForeignKey(User, related_name="vendor_conversations", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    # Inside your Conversation model class
    last_message_at = models.DateTimeField(null=True, blank=True)
    

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)

    text = models.TextField(blank=True)
    image = models.ImageField(upload_to='messages/', null=True, blank=True)

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
            is_new = self._state.adding
            super().save(*args, **kwargs)
            
            if is_new:
                # Explicitly force the conversation timestamp to match the message time
                self.conversation.last_message_at = self.created_at
                self.conversation.save(update_fields=['last_message_at'])

    class Meta:
       
        ordering = ['-created_at']
        