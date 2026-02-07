from datetime import datetime
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.permissions import AllowAny
from api.v1.Bookings.utils import get_available_slots
from api.v1.Reviews.serializers import ReviewSerializer
from api.v1.Vendor.models import IndividualVendorProfile
from .models import SalonProfile, SalonServices
from rest_framework import serializers
from api.v1.Category.serializers import CategorySerializer, GallerySerializer
from api.v1.Category.models import Gallery, Availability
from django.core.exceptions import ValidationError as DjangoValidationError

class SalonServicesSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    class Meta:
        model = SalonServices
        fields = ('salon', 'name', 'description', 'price', 'duration_minutes', 'categories')
        read_only_fields = ["id", "salon"]


class SalonProfileSerializer(serializers.ModelSerializer):
    salon_services = SalonServicesSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True) # Usually a salon has 1 category
    salon_portfolio = GallerySerializer(many=True, read_only=True)

    salon_reviews = ReviewSerializer(many=True, read_only=True, source='reviews') 

    class Meta:
        model = SalonProfile
        fields = (
            "id", "owner", "name", "categories", "about", "address", 
            "latitude", "longitude", "profile_pic", "salon_portfolio", 
            "links", "created_at", "is_open", "salon_services", "salon_reviews"
        )
        read_only_fields = ["id", "owner", "created_at"]
