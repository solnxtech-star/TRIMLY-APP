from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()

@database_sync_to_async
def get_user(token):
    try:
        # Validate the JWT
        access_token = AccessToken(token)
        return User.objects.get(id=access_token['user_id'])
    except Exception as e:
        print(f"JWT Auth Error: {e}") # This will tell you WHY it's anonymous
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # 1. Get token from Query String
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params.get("token", [None])[0]

        # 2. Authenticate
        if token:
            scope["user"] = await get_user(token)
        else:
            scope["user"] = AnonymousUser()

        # 3. Hand off to the next layer
        return await self.app(scope, receive, send)