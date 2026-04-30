from datetime import timezone

from djangochannelsrestframework.generics import AsyncAPIConsumer
from djangochannelsrestframework.decorators import action
from .models import Conversation , Message
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async, aclose_old_connections

class ChatConsumer(AsyncAPIConsumer):
    """
    Only when the user clicks on a specific conversation
    To send and receive actual chat messages
    """
    async def connect(self):
        await aclose_old_connections()
        await self.accept()
        try:
            print(self.scope["user"])
            self.user = self.scope["user"]

            self.conversation_id = self.scope["url_route"]['kwargs']["conversation_uuid"]
            
            # 2. Get Conversation (Safe Async way)
            has_access = await self.check_room_access(self.conversation_id, self.user)        # 3. Check Permissions (Privacy Wall)
            if has_access:
                self.group_name = f"chat_{self.conversation_id}"
                
                # Join Redis Group
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                print(f"Accepted: {self.user} joined {self.conversation_id}")
                
                # Send initial confirmation to frontend
                await self.send_json({
                    "type": "connection_established",
                    "message": "You have joined the conversation",
                    "conversation_id": str(self.conversation_id)
                })
            else:
                # Not authorized or room doesn't exist
                await self.accept()
                await self.send_json({
                    "type": "unable to connect",
                    "message": "Yyou are not authenticated",
                    "conversation_id": str(self.conversation_id)})
                await self.close(code=4003)
        except Exception as e:
            print(f"error {e}")
     

    # Helper method to touch the DB
    @database_sync_to_async
    def check_room_access(self, uuid, user):
        if user.is_anonymous :
            return False
        
        try:
            conv =  Conversation.objects.get(id=uuid)
            return user.id == conv.vendor_id or user.id == conv.customer_id
        
        except Conversation.DoesNotExist:
            return None
    @database_sync_to_async
    def create_message_object(self, message, conversation_id, sender):
        conversation = get_object_or_404(Conversation, id=conversation_id)
        Message.objects.create(
           conversation = conversation,
           sender = sender,
           text = message
        )
    
    @database_sync_to_async
    def get_recipient_id(self, conversation_id, sender_id):
        conv = Conversation.objects.get(id=conversation_id)
        # If the sender is the customer, the recipient is the vendor (and vice versa)
        if str(conv.customer_id) == str(sender_id):
            return conv.vendor_id
        return conv.customer_id


# messaging/consumers.py

    @action()
    async def join_room(self, room_id=None, **kwargs):
        await aclose_old_connections()
        # DCRF passes 'room_id' here directly from the 'data' key in your JSON
        
        if room_id is None:
            # Check if it's hiding inside kwargs instead
            room_id = kwargs.get('data', {}).get('room_id')

        if not room_id:
            return {'error': 'room_id is still missing'}, 400
        self.group_name = f"chat_{room_id}"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        return {'status': 'joined', 'room': room_id}, 200



    @action()
    
    async def send_message(self, message=None, **kwargs):
        # 1. Resolve the lazy user object into a real User instance
        user = self.scope["user"]
        if user.is_anonymous:
            # Handle cases where the user isn't logged in
            return await self.send_json({"action": "error", "message": "User not authenticated"})

        # 2. Extract message if not provided in args
        if not message:
            message = kwargs.get('data', {}).get('message')

        try:
            # Use the resolved 'user' variable here
            await self.create_message_object(
                conversation_id=self.conversation_id,
                message=message,
                sender=user  # <--- Pass the resolved user
            )
            
            # 3. Broadcast to the group
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat.message",
                    "message": message,
                    "sender": str(user.id)
                }
            )
            # 3. TRIGGER NOTIFICATION (For the person NOT in the chat)
            recipient_id = await self.get_recipient_id(self.conversation_id, user.id)
            print(f"SENDING TO GROUP: user_notifications_{recipient_id!r}")  # !r shows the type
            recipient_id = await self.get_recipient_id(self.conversation_id, user.id)
            print(f"DEBUG: Customer sending notification to user_notifications_{recipient_id}")
            print(f"this is the recepient_id: {recipient_id}")
            print(f"user_notifications_{recipient_id}"),
            await self.channel_layer.group_send(
                f"user_notifications_{str(recipient_id)}",
                {
                    "type": "send_notification", # Matches method in NotificationConsumer
                    "data": {
                        "type": "chat_message",
                        "conversation_id": str(self.conversation_id),
                        "sender_name": f"{user.first_name}",
                        "text": message[:50], # Snippet for the toast
                        "created_at": str(timezone.now())
                    }
                }
            )

        except Exception as e:
            await self.send_json({"action": "send_message", "status": "error", "message": str(e)})
        except Exception as e:
            await self.send_json({"action": "send_message", "status": "error", "message": str(e)})
  

  