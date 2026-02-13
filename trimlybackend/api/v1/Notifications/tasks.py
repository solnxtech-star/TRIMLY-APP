from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.contenttypes.models import ContentType
from .models import Notification

@shared_task
def create_and_send_notification(recipient_id, actor_id, verb, target_model_name, target_id):
    # 1. Get the right model for the target (e.g., 'Booking')
    target_ct = ContentType.objects.get(model=target_model_name.lower())
    
    # 2. Create the notification record
    notif = Notification.objects.create(
        recipient_id=recipient_id,
        actor_id=actor_id,
        verb=verb,
        content_type=target_ct,
        object_id=target_id
    )

    # 3. Push to WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_notifications_{recipient_id}",
        {
            "type": "send_notification",
            "data": {
                "id": notif.id,
                "verb": verb,
                "target_id": target_id,
                "target_type": target_model_name,
                "message": f"Someone {verb} a {target_model_name}"
            }
        }
    )