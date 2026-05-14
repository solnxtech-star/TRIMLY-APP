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

    async def send_notification(self, event):
        # 'event' contains everything sent from the Celery task
        # including the 'type' key which we don't need on the frontend.
        
        # Create a copy so we don't modify the original event
        payload = dict(event)
        payload.pop("type", None) # Remove the handler name

        print(f"DEBUG: Sending to User {self.user.id}: {payload}")
        
        # Send the clean payload to the frontend
        await self.send(text_data=json.dumps(payload))