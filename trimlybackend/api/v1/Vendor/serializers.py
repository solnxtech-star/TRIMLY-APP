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
    vendor_name = serializers.CharField(read_only=True, source="worker.get_full_name")
    class Meta:
        model = IndividualVendorProfile
        fields = ["id", "vendor_name", "category",
                  "bio", "profile_pic", "location", "address", "is_active", "is_available"]
        read_only_fields = ["vendor", "id", "is_active", "is_available" ]

class VendorDetailSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(read_only=True, source="worker.get_full_name")
    vendor_services = VendorServicesSerializer(many=True, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    vendor_portfolio = GallerySerializer(many=True, read_only=True)
    vendor_reviews = ReviewSerializer(many=True, read_only=True, source='reviews') 

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "worker","vendor_name", "category",  "bio", "profile_pic", 
            "location", "address",
            "is_active", "is_available",
            "vendor_services", "vendor_portfolio", "vendor_reviews", "review_count", "average_rating"
        ]
        read_only_fields = ["id", "worker", "total_earnings", "vendor_services", "vendor_portfolio", 
                            "vendor_reviews", "review_count", "average_rating", "is_active", "is_available",]

class SlotResponseSerializer(serializers.Serializer):
    vendor_id = serializers.UUIDField()
    date = serializers.DateTimeField()
    slots = serializers.CharField()