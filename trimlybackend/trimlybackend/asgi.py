import os
import django
from django.core.asgi import get_asgi_application

# 1. Set the settings module first
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trimlybackend.settings')

# 2. Initialize Django ASGI application EARLY.
# This populates the AppRegistry so models/settings are available.
django_asgi_app = get_asgi_application()

# 3. NOW you can import things that depend on Django settings/models
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from api.v1.Chat.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    # Use the initialized django_asgi_app here
    "http": django_asgi_app,
    
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})