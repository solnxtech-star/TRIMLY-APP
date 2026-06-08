from rest_framework import serializers
from django.contrib.gis.geos import Point
from api.v1.Category.serializers import CategorySerializer, GalleryPostSerializer
from api.v1.Reviews.serializers import ReviewSerializer
from .models import IndividualVendorProfile, VendorServices
from api.v1.Category.models import ServiceCategory


class VendorServicesSerializer(serializers.ModelSerializer):
    # 1. READ-ONLY FIELD: Used to output full nested objects during GET requests
    categories = CategorySerializer(many=True, read_only=True)
    
    # 2. WRITE-ONLY FIELD: Accepts an array of category Primary Keys during POST/PUT requests
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCategory.objects.all(),
        many=True,
        write_only=True,
        source='categories', # Automatically maps this array to the model's many-to-many relationship
        help_text="An array of category IDs to link to this vendor service."
    )
    
    class Meta:
        model = VendorServices
        fields = (
            'id', 
            'vendor', 
            'name', 
            'description', 
            'price', 
            'duration_minutes', 
            'categories',   # Visible in response payloads
            'category_ids'  # Visible in request inputs
        )
        read_only_fields = ["id", "vendor"]

    def create(self, validated_data):
        # DRF's default create handler cannot save nested many-to-many data automatically 
        # when customized models are involved, so we extract and handle them cleanly.
        categories = validated_data.pop('categories', [])
        
        # Save the primary service asset instance
        vendor_service = VendorServices.objects.create(**validated_data)
        
        # Attach the many-to-many category relationships cleanly
        if categories:
            vendor_service.categories.set(categories)
            
        return vendor_service

    def update(self, instance, validated_data):
        # Handle many-to-many updates safely for PUT/PATCH operations
        categories = validated_data.pop('categories', None)
        
        # Update the standard text/numeric fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Overwrite the many-to-many mapping if category arrays are included in payload
        if categories is not None:
            instance.categories.set(categories)
            
        return instance


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
            "total_earnings", "average_rating", "is_active", "is_available", "is_nin_verified", "nin_verified_at", "tags",
            "bank_name", "account_number", "account_name"
        ]
        # Secured: Bank information fields are completely absent from editable fields
        read_only_fields = ["vendor", "id", "is_active", "is_available", "is_nin_verified", "nin_verified_at", "total_earnings", "bank_name", "account_number", "account_name"]

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




class VendorDetailSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(read_only=True, source="worker.get_full_name")
    vendor_services = VendorServicesSerializer(many=True, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    vendor_portfolio = GalleryPostSerializer(many=True, read_only=True)
    vendor_reviews = ReviewSerializer(many=True, read_only=True, source='reviews') 
    
    longitude = serializers.FloatField(required=False)
    latitude = serializers.FloatField(required=False)

    class Meta:
        model = IndividualVendorProfile
        fields = [
            "id", "worker", "vendor_name", "category", "bio", "profile_pic", "phone_number", "years_of_experience", "total_earnings", "tags",
            "latitude", "longitude", "address", "is_active", "is_available", "is_nin_verified", "nin_verified_at",
            "vendor_services", "vendor_portfolio", "vendor_reviews", "review_count", "average_rating", "bank_name", "account_number", "account_name"
        ]
        # Added 'worker' here to ensure it doesn't complain about validation on direct POST calls
        read_only_fields = [
            "id", "worker", "total_earnings", "vendor_services", "vendor_portfolio", 
            "vendor_reviews", "review_count", "average_rating", "is_active", "is_available",
            "is_nin_verified", "nin_verified_at","bank_name", "account_number", "account_name"
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