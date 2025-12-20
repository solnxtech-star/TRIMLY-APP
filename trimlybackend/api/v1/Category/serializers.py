from rest_framework import serializers
from .models import Availability, AvailabilityException, ServiceCategory, Gallery
from django.core.exceptions import ValidationError as DjangoValidationError

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = "__all__"
        read_only_fields = ["id", "created_at"]

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ("id", "salon", "vendor", "caption","image", "created_at")
        read_only_fields = ("id", "salon", "vendor", "created_at")

    
class AvailaibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = [
            "id",
            "date",
            "start_time",
            "end_time",
            "salon",
            "vendor",
        ]
        read_only_fields = ("id", "salon", "vendor")

    def validate(self, attrs):
        salon = attrs.get("salon")
        vendor = attrs.get("vendor")

        if not salon and not vendor:
            raise serializers.ValidationError(
                "Availability must belong to a salon or a vendor."
            )

        if salon and vendor:
            raise serializers.ValidationError(
                "Availability cannot belong to both salon and vendor."
            )

        return attrs


class AvailabilityExceptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityException
        fields = "__all__"
        read_only_fields = ("id", "salon", "vendor")
    
    def validate(self, attrs):
   
        instance = AvailabilityException(**attrs)
        try:
            # 2. Trigger model-level validation (clean(), clean_fields(), etc.)
            instance.full_clean()
        except DjangoValidationError as e:
            # 3. Convert Django error to DRF error format for a 400 response
            raise serializers.ValidationError(e.message_dict)
        return attrs
