from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .models import SalonProfile
from .serializers import SalonProfileSerializer
# Create your views here.

class Salon(ListAPIView):
    queryset = SalonProfile.objects.all()
    serializer_class = SalonProfileSerializer
    def get_queryset(self):
        return SalonProfile.objects.all()