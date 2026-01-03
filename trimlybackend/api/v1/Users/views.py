from django.shortcuts import render
from .models import User
from .serializers import UserDetailSerializer
from rest_framework.generics import ListAPIView,  RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from .permissions import IsApplicationAdmin
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView
from .serializers import EmailLoginSerializer, CustomRegisterSerializer
from .docs.auth import login_schema, register_schema


class UserProfileListView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsApplicationAdmin]


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:8000/accounts/google/login/callback/" # Must match Google Console
    client_class = OAuth2Client


class EmailLoginView(LoginView):
    serializer_class = EmailLoginSerializer


EmailLoginView = login_schema(EmailLoginView)


class EmailRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer


EmailRegisterView = register_schema(EmailRegisterView)
