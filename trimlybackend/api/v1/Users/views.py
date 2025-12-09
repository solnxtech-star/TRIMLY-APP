from django.shortcuts import render
from .models import User
from .serializers import UserDetailSerializer
from rest_framework.generics import ListAPIView,  RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from .permissions import IsApplicationAdmin

class UserProfileListView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsApplicationAdmin]
