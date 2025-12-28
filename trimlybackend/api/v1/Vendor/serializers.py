from api.v1.Category.serializers import CategorySerializer, GallerySerializer
from api.v1.Reviews.serializers import ReviewSerializer
from .models import IndividualVendorProfile, VendorServices
from rest_framework import serializers


class VendorServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorServices
        fields = "__all__"
        read_only_fields = ["vendor", "id", ]

class VendorSerializer(serializers.ModelSerializer):
    vendor_services = VendorServicesSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True) 
    vendor_portfolio = GallerySerializer(many=True, read_only=True)
    vendor_reviews = ReviewSerializer(many=True, read_only=True, source='reviews') 

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "worker", "category", "bio", "profile_pic", 
            "years_of_experience", "Gender", "is_active", 
            "vendor_services", "vendor_portfolio", "vendor_reviews"
        ]
        read_only_fields = ["id", "worker", "total_earnings"]