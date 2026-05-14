from django.utils import timezone
from djangochannelsrestframework.generics import AsyncAPIConsumer
from djangochannelsrestframework.decorators import action
from .models import Conversation, Message
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async, aclose_old_connections

# Import your notification task
from api.v1.Notifications.tasks import create_and_send_notification

class ChatConsumer(AsyncAPIConsumer):
    """
    Consumer for real-time chat. Handles message persistence 
    and triggers background notifications for recipients.
    """
    
    async def connect(self):
        await aclose_old_connections()
        await self.accept()
        
        try:
            self.user = self.scope["user"]
            self.conversation_id = self.scope["url_route"]['kwargs']["conversation_uuid"]
            
            # Check permissions via privacy wall
            has_access = await self.check_room_access(self.conversation_id, self.user)
            
            if has_access:
                self.group_name = f"chat_{self.conversation_id}"
                
                # Join Redis Group
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                
                # Send initial confirmation to frontend
                await self.send_json({
                    "type": "connection_established",
                    "message": "You have joined the conversation",
                    "conversation_id": str(self.conversation_id)
                })
            else:
                await self.send_json({
                    "type": "unable_to_connect",
                    "message": "You are not authorized or room doesn't exist",
                    "conversation_id": str(self.conversation_id)
                })
                await self.close(code=4003)
                
        except Exception as e:
            print(f"WS Connection Error: {e}")

    # --- Database Operations (Async) ---

    @database_sync_to_async
    def check_room_access(self, uuid, user):
        if user.is_anonymous:
            return False
        try:
            conv = Conversation.objects.get(id=uuid)
            return user.id == conv.vendor_id or user.id == conv.customer_id
        except Conversation.DoesNotExist:
            return False

    @database_sync_to_async
    def create_message_object(self, message, conversation_id, sender):
        conversation = get_object_or_404(Conversation, id=conversation_id)
        return Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=message
        )

    @database_sync_to_async
    def get_recipient_id(self, conversation_id, sender_id):
        conv = Conversation.objects.get(id=conversation_id)
        # Determine who is the receiver (opposite of sender)
        if str(conv.customer_id) == str(sender_id):
            return conv.vendor_id
        return conv.customer_id

    # --- Actions ---

    @action()
    async def join_room(self, room_id=None, **kwargs):
        """Action-based room joining (for DCRF frontend compatibility)"""
        if room_id is None:
            room_id = kwargs.get('data', {}).get('room_id')

        if not room_id:
            return {'error': 'room_id is missing'}, 400
            
        self.group_name = f"chat_{room_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        return {'status': 'joined', 'room': room_id}, 200

    @action()
    async def send_message(self, message=None, **kwargs):
        user = self.scope["user"]
        if user.is_anonymous:
            return await self.send_json({"action": "error", "message": "User not authenticated"})

        if not message:
            message = kwargs.get('data', {}).get('message')

        try:
            # 1. Save Chat Message to DB
            await self.create_message_object(
                conversation_id=self.conversation_id,
                message=message,
                sender=user
            )
            
            # 2. Broadcast to current room (Live Chat UI)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat_broadcast_handler",
                    "message": message,
                    "sender_id": str(user.id),
                    "sender_name": f"{user.first_name}"
                }
            )

            # 3. Trigger Notification (Standardized Format)
            recipient_id = await self.get_recipient_id(self.conversation_id, user.id)
            
            # Use sync_to_async because Eager mode makes the task run SYNC-ly
            # which can hang the async consumer loop
            from asgiref.sync import sync_to_async
            await sync_to_async(create_and_send_notification.delay)(
                recipient_id=str(recipient_id),
                actor_id=str(user.id),
                verb="messaged",
                target_model_name="Conversation",
                target_id=str(self.conversation_id),
            )

        except Exception as e:
            await self.send_json({"action": "send_message", "status": "error", "message": str(e)})
    
    # --- Group Message Handlers ---

    async def chat_broadcast_handler(self, event):
        """
        Receives messages from the channel layer group and sends them to the client.
        """
        # This sends the actual JSON to the Flutter app
        await self.send_json({
            "action": "new_message",
            "data": {
                "message": event["message"],
                "sender_id": event["sender_id"],
                "sender_name": event["sender_name"],
                "created_at": timezone.now().isoformat(),
            }
        })