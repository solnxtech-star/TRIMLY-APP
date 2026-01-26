from djangochannelsrestframework.generics import AsyncAPIConsumer
from djangochannelsrestframework.decorators import action
from .models import Conversation , Message
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async

class ChatConsumer(AsyncAPIConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        conversation_id = self.scope["url_route"]['kwargs']["conversation_uuid"]
        
        # 2. Get Conversation (Safe Async way)
        # has_access = await self.check_room_access(conversation_id, self.user)        # 3. Check Permissions (Privacy Wall)
        # if has_access:
        self.group_name = f"chat_{conversation_id}"
        
        # Join Redis Group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"Accepted: {self.user} joined {conversation_id}")
        
        # Send initial confirmation to frontend
        await self.send_json({
            "type": "connection_established",
            "message": "You have joined the conversation",
            "conversation_id": str(conversation_id)
        })
    # else:
    #     # Not authorized or room doesn't exist
    #     print(f"Rejected: {self.user} has no access to {conversation_id}")
    #     await self.close(code=4003)
     

    # Helper method to touch the DB
    @database_sync_to_async
    def check_room_access(self, uuid, user):
        if not user.is_authenticated:
            return False
        
        try:
            conv =  Conversation.objects.get(id=uuid)
            return user.id == conv.vendor_id or user.id == conv.customer_id
        
        except Conversation.DoesNotExist:
            return None

# messaging/consumers.py

    @action()
    async def join_room(self, room_id=None, **kwargs):
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
    async def send_message(self,  message = None, **kwargs):
        # Broadcast the message to everyone in the group
        if not message:
            message = kwargs.get('data', {}).get('message')
        try:

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat.message", # Matches the method below
                    "message": message,
                    "sender": self.scope["user"].id
                }
            )
        except Exception as e:
            print({"error" : e})
  

    async def chat_message(self, event):
        # This sends the actual data to the WebSocket
        await self.send_json(event)