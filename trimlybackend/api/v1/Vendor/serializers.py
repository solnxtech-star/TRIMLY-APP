from rest_framework import serializers
from django.contrib.gis.geos import Point
from api.v1.Category.serializers import CategorySerializer, GallerySerializer
from api.v1.Reviews.serializers import ReviewSerializer
from .models import IndividualVendorProfile, VendorServices

class VendorServicesSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = VendorServices
        fields = ('id', 'vendor', 'name', 'description', 'price', 'duration_minutes', 'categories')
        read_only_fields = ["id", "vendor"]


class VendorSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(read_only=True, source="worker.get_full_name")
    review_count = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    longitude = serializers.FloatField(required=False)
    latitude = serializers.FloatField(required=False)

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "vendor_name", "category", "bio", "profile_pic", "phone_number",
            "years_of_experience", "latitude", "longitude", "address", "review_count", 
            "total_earnings", "average_rating", "is_active", "is_available", "is_nin_verified", "nin_verified_at", "tags"
        ]
        # Secured: Bank information fields are completely absent from editable fields
        read_only_fields = ["vendor", "id", "is_active", "is_available", "is_nin_verified", "nin_verified_at", "total_earnings"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.location:
            representation['longitude'] = instance.location.x
            representation['latitude'] = instance.location.y
        else:
            representation['longitude'] = None
            representation['latitude'] = None
        return representation

    def validate(self, attrs):
        latitude = attrs.pop('latitude', None)
        longitude = attrs.pop('longitude', None)
        if latitude is not None and longitude is not None:
            try:
                attrs['location'] = Point(float(longitude), float(latitude))
            except (ValueError, TypeError):
                raise serializers.ValidationError({"location": "Invalid coordinate format."})
        return attrs


# Verification-Specific DTO Input Structure
class VerifyBankAccountSerializer(serializers.Serializer):
    bank_code = serializers.CharField(max_length=15)
    account_number = serializers.CharField(max_length=15)


class VendorDetailSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(read_only=True, source="worker.get_full_name")
    vendor_services = VendorServicesSerializer(many=True, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    vendor_portfolio = GallerySerializer(many=True, read_only=True)
    vendor_reviews = ReviewSerializer(many=True, read_only=True, source='reviews') 
    
    longitude = serializers.FloatField(required=False)
    latitude = serializers.FloatField(required=False)

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "worker", "vendor_name", "category", "bio", "profile_pic", "phone_number", "years_of_experience", "total_earnings", "tags",
            "latitude", "longitude", "address", "is_active", "is_available", "is_nin_verified", "nin_verified_at",
            "vendor_services", "vendor_portfolio", "vendor_reviews", "review_count", "average_rating"
        ]
        # Added 'worker' here to ensure it doesn't complain about validation on direct POST calls
        read_only_fields = [
            "id", "worker", "total_earnings", "vendor_services", "vendor_portfolio", 
            "vendor_reviews", "review_count", "average_rating", "is_active", "is_available",
            "is_nin_verified", "nin_verified_at"
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.location:
            representation['longitude'] = instance.location.x
            representation['latitude'] = instance.location.y
        else:
            representation['longitude'] = None
            representation['latitude'] = None
        return representation

    def validate(self, attrs):
        latitude = attrs.pop('latitude', None)
        longitude = attrs.pop('longitude', None)

        if latitude is not None and longitude is not None:
            try:
                attrs['location'] = Point(float(longitude), float(latitude))
            except (ValueError, TypeError):
                raise serializers.ValidationError(
                    {"location": "Invalid latitude or longitude format structure."}
                )
        return attrs


class SlotResponseSerializer(serializers.Serializer):
    vendor_id = serializers.UUIDField()
    date = serializers.DateTimeField()
    slots = serializers.CharField()