from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.contenttypes.models import ContentType
from .models import Notification
from asgiref.sync import async_to_sync, sync_to_async

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def create_and_send_notification(self, recipient_id, actor_id, verb, target_model_name, target_id):
    # 1. Helper to run DB logic safely in Eager/Sync mode
        # 2. Message Phrasing
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
    def get_data():
        target_ct = ContentType.objects.get(model=target_model_name.lower())
        notif = Notification.objects.create(
            recipient_id=recipient_id,
            actor_id=actor_id,
            verb=verb,
            message = display_message,
            content_type=target_ct,
            object_id=target_id,
            is_read=False
        )
        return notif, notif.actor.get_full_name()

    # Execute DB logic
    notif, actor_name = get_data()


    # 3. Push to WebSocket
    channel_layer = get_channel_layer()
    
    # FIX: Ensure this matches your NotificationConsumer.py group name!
    # Usually it's notifications_{id} or user_notifications_{id}
    group_name = f"notifications_{str(recipient_id)}" 
    
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
                "created_at": notif.created_at.isoformat()
            }
        }
    )