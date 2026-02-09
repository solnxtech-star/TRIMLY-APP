from api.v1.Category.serializers import CategorySerializer, GallerySerializer
from api.v1.Reviews.serializers import ReviewSerializer
from .models import IndividualVendorProfile, VendorServices
from rest_framework import serializers

class VendorServicesSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    class Meta:
        model = VendorServices
        fields = ('vendor', 'name', 'description', 'price', 'duration_minutes', 'categories')
        read_only_fields = ["id", "vendor"]

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualVendorProfile
        fields = ["id", "worker", "category", "date_of_birth", 
                  "bio", "profile_pic", "years_of_experience", 
                  "Gender", "latitude", "longitude", "address", "flw_subaccount_id", 
                  "bank_code", "account_number", "total_earnings", "is_active", "is_available"]
        read_only_fields = ["vendor", "id", "is_active", "is_available" ]

class VendorDetailSerializer(serializers.ModelSerializer):
    vendor_services = VendorServicesSerializer(many=True, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    vendor_portfolio = GallerySerializer(many=True, read_only=True)
    vendor_reviews = ReviewSerializer(many=True, read_only=True, source='reviews') 

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "worker", "category", "date_of_birth", "bio", "profile_pic", 
            "years_of_experience", "Gender", "latitude", "longitude", "address", "flw_subaccount_id", 
            "bank_code", "account_number", "total_earnings", "is_active", "is_available",
            "vendor_services", "vendor_portfolio", "vendor_reviews", "review_count", "average_rating"
        ]
        read_only_fields = ["id", "worker", "total_earnings"]

class SlotResponseSerializer(serializers.Serializer):
    vendor_id = serializers.UUIDField()
    date = serializers.DateTimeField()
    slots = serializers.CharField()