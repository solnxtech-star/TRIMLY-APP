from rest_framework import serializers
from .models import Availability, AvailabilityException, ServiceCategory
from django.core.exceptions import ValidationError as DjangoValidationError

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ("id", "name", "category_image", "created_at")
        read_only_fields = ["id", "created_at"]


from .models import GalleryPost, GalleryImage

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ("id", "image", "created_at")


class GalleryPostSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=True),
        write_only=True
    )

    class Meta:
        model = GalleryPost
        fields = ("id", "salon", "vendor", "caption", "images", "uploaded_images", "created_at")
        read_only_fields = ("id", "salon", "vendor", "created_at")

    def validate(self, data):
        # FIX: Read from context (passed by the view via URL), NOT from the request body data
        vendor = self.context.get('vendor')
        salon = self.context.get('salon')
        
        if (vendor and salon) or (not vendor and not salon):
            raise serializers.ValidationError("System error: View must provide exactly one provider context.")
        
        return data

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images')
        caption = validated_data.get('caption', '')
        vendor = self.context.get('vendor')
        salon = self.context.get('salon')

        with transaction.atomic():
            post = GalleryPost.objects.create(
                vendor=vendor,
                salon=salon,
                caption=caption
            )
            
            image_instances = [
                GalleryImage(post=post, image=img) for img in uploaded_images
            ]
            GalleryImage.objects.bulk_create(image_instances)
            
        return post

    
from django.db import transaction

class IndividualAvailabilityDaySerializer(serializers.ModelSerializer):
    """
    Handles validation for an individual day object inside the bulk payload.
    """
    class Meta:
        model = Availability
        fields = ["id", "day_of_week", "start_time", "end_time"]

    def validate(self, attrs):
        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("Start time must be before end time.")
        return attrs


class BulkAvailabilitySerializer(serializers.Serializer):
    """
    Accepts an array of schedules, replaces any existing schedule configuration 
    for the provider, and saves them efficiently in a single atomic bulk operation.
    """
    schedules = IndividualAvailabilityDaySerializer(many=True, allow_empty=False)

    def validate(self, attrs):
        schedules_data = attrs.get("schedules", [])
        
        # 1. Check for incoming duplicate days in the payload itself
        days_in_payload = [item["day_of_week"] for item in schedules_data]
        if len(days_in_payload) != len(set(days_in_payload)):
            raise serializers.ValidationError(
                {"schedules": "You cannot submit duplicate configurations for the same day of the week."}
            )

        # Note: Database overlap checks are removed here because we drop 
        # previous rows during execution to clear the slate.
        return attrs

    def create(self, validated_data):
        schedules_data = validated_data.pop("schedules")
        vendor = self.context.get("vendor")
        salon = self.context.get("salon")

        availability_instances = []
        
        # Use an atomic transaction block to make sure it's all-or-nothing
        with transaction.atomic():
            # 1. Purge existing configurations for this specific provider first
            old_schedules = Availability.objects.all()
            if salon:
                old_schedules.filter(salon=salon).delete()
            elif vendor:
                old_schedules.filter(vendor=vendor).delete()

            # 2. Map new configurations into model instances
            for day_data in schedules_data:
                instance = Availability(
                    vendor=vendor,
                    salon=salon,
                    day_of_week=day_data["day_of_week"],
                    start_time=day_data["start_time"],
                    end_time=day_data["end_time"]
                )
                availability_instances.append(instance)
            
            # Efficient database operation instead of loop-saving
            return Availability.objects.bulk_create(availability_instances)


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

