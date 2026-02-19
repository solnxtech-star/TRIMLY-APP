from django.urls import path
from . import consumers


notification_urlpatterns = [
    path('ws/notifications/', consumers.NotificationConsumer.as_asgi()),
]