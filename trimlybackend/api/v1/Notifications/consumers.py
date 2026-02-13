from djangochannelsrestframework.generics import AsyncAPIConsumer
from djangochannelsrestframework.decorators import action

class NotificationConsumer(AsyncAPIConsumer):
    """connect as soon as the user logs in
    """
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            # unique group for this specific user
            self.group_name = f"user_notifications_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close(code=4001)

    # This method is called by the Celery task via group_send
    async def send_notification(self, event):
        await self.send_json(event["data"])