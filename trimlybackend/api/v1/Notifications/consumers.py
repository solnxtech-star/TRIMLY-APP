# api/v1/Chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import aclose_old_connections

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await aclose_old_connections()
        self.user = self.scope.get("user")
        print(type(self.user.id))

        if self.user and self.user.is_authenticated:
            self.group_name = f"user_notifications_{str(self.user.id)}"
            print(self.group_name)
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            
            await self.send(text_data=json.dumps({
                "message": "Connected to standard notifications stream"
            }))
        else:
            # Rejection logic
            await self.accept() # Accept to send the error
            await self.send(text_data=json.dumps({"error": "Unauthenticated"}))
            await self.close(code=4003)

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Standard Channels looks for this method exactly as named in 'type'
    async def send_notification(self, event):
        print(f"DEBUG: !!! MESSAGE RECEIVED !!! for User {self.user.id}")
        await self.send(text_data=json.dumps(event["data"]))