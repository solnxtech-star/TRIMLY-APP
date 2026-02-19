from djangochannelsrestframework.generics import AsyncAPIConsumer
from djangochannelsrestframework.decorators import action
from channels.db import aclose_old_connections

class NotificationConsumer(AsyncAPIConsumer):
    """connect as soon as the user logs in
    """
    async def connect(self):
        await aclose_old_connections()
        await self.accept()
        try:
            self.user = self.scope["user"]
            if self.user.is_authenticated:
                # unique group for this specific user
                self.group_name = f"user_notifications_{self.user.id}"
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                
            else:
                await self.close(code=4001)
        except Exception as e:
            print(f"error {e}")

    # This method is called by the Celery task via group_send
    async def send_notification(self, event):
        await self.send_json(event["data"])

