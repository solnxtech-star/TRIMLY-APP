from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.contenttypes.models import ContentType
from .models import Notification
@shared_task(
    bind=True, 
    autoretry_for=(Exception,), 
    retry_backoff=True, # Resend is stable, but always good to have backoff
    max_retries=3
)
def create_and_send_notification(self, recipient_id, actor_id, verb, target_model_name, target_id):
    # 1. Get the right model for the target (e.g., 'Booking')
    target_ct = ContentType.objects.get(model=target_model_name.lower())
    
    # 2. Create the notification record
    notif = Notification.objects.create(
        recipient_id=recipient_id,
        actor_id=actor_id,
        verb=verb,
        content_type=target_ct,
        object_id=target_id,
        is_read = False
    )
    # Dynamic Message Generation
    display_message = ''
    actor_name = notif.actor.get_full_name()
    if verb == "messaged":
        display_message = f"You have a new message from {actor_name}"
    elif verb == "booked":
        display_message = f"{actor_name} just booked an appointment with you"
    else:
        display_message = f"New update from {actor_name}"


    # 3. Push to WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_notifications_{str(recipient_id)}",
        {
            "type": "send_notification",
            "data": {
                "id": str(notif.id),
                "actor_name": notif.actor.get_full_name(),
                "verb": verb,
                "target_id": str(target_id),
                "target_type": target_model_name.lower(),
                "message": display_message,
                "is_read" : notif.is_read,
                "created_at": notif.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            }
        }
    )