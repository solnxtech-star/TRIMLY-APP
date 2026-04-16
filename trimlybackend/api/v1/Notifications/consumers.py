from djangochannelsrestframework.generics import AsyncAPIConsumer
from djangochannelsrestframework.decorators import action
from channels.db import aclose_old_connections

class NotificationConsumer(AsyncAPIConsumer):
    """connect as soon as the user logs in
    """
    async def connect(self):
        await aclose_old_connections()
        
        # 1. Accept first to prevent 'handshake_deferred' error
        await self.accept() 
        
        self.user = self.scope.get("user")

        # 2. Check if the middleware actually found a user
        if self.user and self.user.is_authenticated:
            self.group_name = f"user_notifications_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            
            # Send a "Welcome" message so you know you're in!
            await self.send_json({"message": "Connected to notifications stream"})
        else:
            # If we get here, the token in your Postman URL is likely missing or invalid
            await self.send_json({"error": "Unauthenticated. Closing connection."}, close=True)

    # This method is called by the Celery task via group_send
    async def send_notification(self, event):
        await self.send_json(event["data"])

