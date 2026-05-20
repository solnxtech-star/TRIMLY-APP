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
    
    # Expose raw floats to Flutter for easy map rendering and profile updates
    longitude = serializers.FloatField(required=False)
    latitude = serializers.FloatField(required=False)

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "vendor_name", "category", "bio", "profile_pic", "phone_number",
            "latitude", "longitude", "address", "review_count", 
            "average_rating", "is_active", "is_available"
        ]
        read_only_fields = ["vendor", "id", "is_active", "is_available"]

    def to_representation(self, instance):
        """Extracts spatial Point coordinates into simple floats for the frontend."""
        representation = super().to_representation(instance)
        if instance.location:
            representation['longitude'] = instance.location.x
            representation['latitude'] = instance.location.y
        else:
            representation['longitude'] = None
            representation['latitude'] = None
        return representation

    def validate(self, attrs):
        """Intercepts incoming lat/long parameters and packages them into the GeoDjango Point Field."""
        latitude = attrs.pop('latitude', None)
        longitude = attrs.pop('longitude', None)

        if latitude is not None and longitude is not None:
            try:
                # SRID 4326 absolute strict order: Point(longitude, latitude)
                attrs['location'] = Point(float(longitude), float(latitude))
            except (ValueError, TypeError):
                raise serializers.ValidationError(
                    {"location": "Invalid latitude or longitude format structure."}
                )
        return attrs


class VendorDetailSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(read_only=True, source="worker.get_full_name")
    vendor_services = VendorServicesSerializer(many=True, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    vendor_portfolio = GallerySerializer(many=True, read_only=True)
    vendor_reviews = ReviewSerializer(many=True, read_only=True, source='reviews') 
    
    # Add coordinate fields here too so detail updates/reads are identical
    longitude = serializers.FloatField(required=False)
    latitude = serializers.FloatField(required=False)

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "worker", "vendor_name", "category", "bio", "profile_pic", "phone_number",
            "latitude", "longitude", "address", "is_active", "is_available",
            "vendor_services", "vendor_portfolio", "vendor_reviews", "review_count", "average_rating"
        ]
        read_only_fields = [
            "id", "worker", "total_earnings", "vendor_services", "vendor_portfolio", 
            "vendor_reviews", "review_count", "average_rating", "is_active", "is_available"
        ]

    def to_representation(self, instance):
        """Extracts spatial Point coordinates into simple floats for the frontend."""
        representation = super().to_representation(instance)
        if instance.location:
            representation['longitude'] = instance.location.x
            representation['latitude'] = instance.location.y
        else:
            representation['longitude'] = None
            representation['latitude'] = None
        return representation

    def validate(self, attrs):
        """Intercepts incoming lat/long parameters and packages them into the GeoDjango Point Field."""
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