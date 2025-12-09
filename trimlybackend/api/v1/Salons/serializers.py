from .models import SalonProfile, SalonServices
from rest_framework import serializers
from api.v1.Category.serializers import CategorySerializer

class SalonServicesSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    class Meta:
        model = SalonServices
        fields = ('salon', 'name', 'description', 'price', 'duration_minutes', 'categories')
        read_only_fields = ["id", "salon"]


class SalonProfileSerializer(serializers.ModelSerializer):
    salon_services = SalonServicesSerializer(many=True, read_only=True)
    category = CategorySerializer(many=True)
    class Meta:
        model = SalonProfile
        fields = ("id", "owner", "category", "about", "address", "latitude", "longitude", "profile_pic", "portfolio", "links", "created_at", "is_open", "salon_services")
        read_only_fields = ["id", "owner", "salon_services"]

    