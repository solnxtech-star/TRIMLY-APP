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
    def save_notification_to_db():
        target_ct = ContentType.objects.get(model=target_model_name.lower())

        # Fetch actor name first so we can build the message before saving
        from api.v1.Users.models import User  # adjust import to your actual User model path
        actor = User.objects.get(id=actor_id)
        name = actor.get_full_name() or actor.username

        if verb == "messaged":
            message = f"You have a new message from {name}"
        elif verb == "booked":
            message = f"{name} just booked an appointment with you"
        elif verb == "cancelled":
            message = f"Booking update: {name} has cancelled the appointment"
        elif verb == "completed":
            message = f"Your booking has been marked as completed by {name}"
        elif verb == "payout_cleared":
            message = "Your funds have been cleared and are available for withdrawal"
        else:
            message = f"New update from {name}"

        notif_obj = Notification.objects.create(
            recipient_id=recipient_id,
            actor_id=actor_id,
            verb=verb,
            content_type=target_ct,
            object_id=target_id,
            is_read=False,
            message=message,   # <-- now actually saved
        )
        return notif_obj, name, message

    notif, actor_name, display_message = save_notification_to_db()

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