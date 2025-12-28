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
            "day_of_week",
            "start_time",
            "end_time",
            "salon",
            "vendor",
        ]
        read_only_fields = ("id", "salon", "vendor", "created_at")

    def validate(self, attrs):
        salon = attrs.get("salon")
        vendor = attrs.get("vendor")
        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")

        if not salon and not vendor:
            raise serializers.ValidationError(
                "Availability must belong to a salon or a vendor."
            )

        if salon and vendor:
            raise serializers.ValidationError(
                "Availability cannot belong to both salon and vendor."
            )
        #Time logic
        if start_time >= end_time:
            raise serializers.ValidationError("Start time must be before end time.")
        # 3️⃣ Overlap detection
        qs = Availability.objects.filter(date=self.date)

        if salon:
            qs = qs.filter(salon=salon)
        else:
            qs = qs.filter(vendor=vendor)

        if self.pk:
            qs = qs.exclude(pk=self.pk)

        overlap_exists = qs.filter(
            start_time__lt=end_time,
            end_time__gt=start_time,
        ).exists()

        if overlap_exists:
            raise serializers.ValidationError("This availability overlaps with an existing one.")
        return attrs





class AvailabilityExceptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityException
        fields = "__all__"
        read_only_fields = ("id", "salon", "vendor")
    
    def validate(self, attrs):
        is_available = attrs.get('is_available')
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')

        # If they mark the day as "Open" (True), they MUST provide times
        if is_available:
            if not start_time or not end_time:
                raise serializers.ValidationError(
                    {"start_time": "Start and end time are required when marking a day as available."}
                )
            if start_time >= end_time:
                raise serializers.ValidationError("Start time must be before end time.")
        
        # If is_available is False (Closed), we can ignore the times or set them to null
        return attrs

