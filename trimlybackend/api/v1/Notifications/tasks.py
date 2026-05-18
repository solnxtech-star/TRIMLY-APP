from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.contenttypes.models import ContentType
from .models import Notification
from asgiref.sync import async_to_sync, sync_to_async

@shared_task(
    bind=True, 
    autoretry_for=(Exception,), 
    retry_backoff=True, 
    max_retries=3
)
def create_and_send_notification(self, recipient_id, actor_id, verb, target_model_name, target_id):
    # 1. Thread-safe DB execution block
    def save_notification_to_db():
        target_ct = ContentType.objects.get(model=target_model_name.lower())
        
        notif_obj = Notification.objects.create(
            recipient_id=recipient_id,
            actor_id=actor_id,
            verb=verb,
            content_type=target_ct,
            object_id=target_id,
            is_read=False
        )
        # Fetch name immediately while we have direct access to the record
        name = notif_obj.actor.get_full_name() or notif_obj.actor.username
        return notif_obj, name

    # 2. Run the DB function and unpack variables safely
    notif, actor_name = save_notification_to_db()
    
    # 3. Formulate the text (Now actor_name is guaranteed to exist here)
    if verb == "messaged":
        display_message = f"You have a new message from {actor_name}"
    elif verb == "booked":
        display_message = f"{actor_name} just booked an appointment with you"
    elif verb == "cancelled":
        display_message = f"Booking update: {actor_name} has cancelled the appointment"
    elif verb == "completed":
        display_message = f"Your booking has been marked as completed by {actor_name}"
    else:
        display_message = f"New update from {actor_name}"

    # 4. Push to Upstash Redis Channel Layer
    channel_layer = get_channel_layer()
    group_name = f"user_notifications_{str(recipient_id)}"
    
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",
            "data": {
                "id": str(notif.id),
                "actor_name": actor_name,
                "verb": verb,
                "target_id": str(target_id),
                "target_type": target_model_name.lower(),
                "message": display_message,
                "is_read": notif.is_read,
                "created_at": notif.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            }
        }
    )