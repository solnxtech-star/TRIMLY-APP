from .models import SalonProfile
from rest_framework import serializers
class SalonProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonProfile
        fields = "__all__"