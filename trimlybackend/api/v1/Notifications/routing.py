from django.urls import path
from . import consumers


notification_urlpatterns = [
    path('ws/notifcations/', consumers.NotificationConsumer.as_asgi()),
]