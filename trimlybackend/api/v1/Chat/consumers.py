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
        if not user.is_authenticated:
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
    async def send_message(self,  message = None, **kwargs):
        await aclose_old_connections()
        # Broadcast the message to everyone in the group
        if not message:
            message = kwargs.get('data', {}).get('message')
        try:
            await self.create_message_object(
                conversation_id=self.conversation_id,
                message=message,
                sender=self.scope["user"]
                )
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat.message", # Matches the method below
                    "message": message,
                    "sender": str(self.scope["user"].id)
                }
            )
        except Exception as e:
            print({"error" : e})
  

    async def chat_message(self, event):
        await aclose_old_connections()
        # This sends the actual data to the WebSocket
        await self.send_json(event)
    # notifications/consumers.py

    async def disconnect(self, close_code):
        # This is where you "clean up"
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        print(f"Cleanup complete for user {self.user.id}")