from .models import Booking
from rest_framework import serializers


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ("id","customer", "salon_service", "vendor_service", "price", "status", "notes")
        read_only_fields = ("id", "customer", "status")

    def validate(self, attrs):
        salon_service = attrs.get("salon_service")
        vendor_service = attrs.get("vendor_service")
        if salon_service and vendor_service:
            raise serializers.ValidationError("cant select both salon and vendor services")
        
        elif not salon_service and not vendor_service:
            raise serializers.ValidationError("you must select atleast one service")
        return attrs
    
    def create(self, validated_data):
        salon_service = validated_data.get("salon_service")
        vendor_service = validated_data.get("vendor_service")
        if salon_service:
            validated_data.pop("salon_service")
    
        elif vendor_service:
            validated_data.pop("vendor_service")

        return Booking.objects.create(**validated_data)
    def to_representation(self, instance):
        return super().to_representation(instance)
        
    