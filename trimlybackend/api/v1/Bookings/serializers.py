from .models import Booking
from rest_framework import serializers


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ("id", "customer", "status", "created_at")

    def create(self, validated_data):

        booking = Booking(**validated_data)
        booking.full_clean()   # 🔥 triggers ALL model validation
        booking.save()

    def validate(self, attrs):
        salon_service = attrs.get("salon_service")
        vendor_service = attrs.get("vendor_service")

        if salon_service and vendor_service:
            raise serializers.ValidationError(
                "You can only book a salon service OR a vendor service."
            )

        if not salon_service and not vendor_service:
            raise serializers.ValidationError(
                "You must provide either salon_service or vendor_service."
            )

        return attrs