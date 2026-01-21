from djangochannelsrestframework.generics import AsyncAPIConsumer
from djangochannelsrestframework.decorators import action

class ChatConsumer(AsyncAPIConsumer):
    
    async def connect(self):
        # Logic to check if this is a valid vendor or user
        await self.accept()
        print("websocket connected")

# messaging/consumers.py

    @action()
    async def join_room(self, room_id=None, **kwargs):
        # DCRF passes 'room_id' here directly from the 'data' key in your JSON
        
        if room_id is None:
            # Check if it's hiding inside kwargs instead
            room_id = kwargs.get('data', {}).get('room_id')

        if not room_id:
            return {'error': 'room_id is still missing'}, 400

        await self.channel_layer.group_add(
            f"chat_{room_id}",
            self.channel_name
        )
        
        return {'status': 'joined', 'room': room_id}, 200



    @action()
    async def send_message(self, room_id, message, **kwargs):
        # Broadcast the message to everyone in the group
        await self.channel_layer.group_send(
            f"chat_{room_id}",
            {
                "type": "chat.message", # Matches the method below
                "message": message,
                "sender": self.scope["user"].id
            }
        )

    async def chat_message(self, event):
        # This sends the actual data to the WebSocket
        await self.send_json(event)