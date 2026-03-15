from .models import Booking
from rest_framework import serializers

from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    # We make end_time read_only because we want the system to calculate it 
    # based on the service duration automatically.
    vendor_name = serializers.ReadOnlyField(source="get_vendor_user.get_full_name")
    vendor_location = serializers.ReadOnlyField(source="get_vendor_user.get_full_name")
    
    class Meta:
        model = Booking
        fields = [
            'id', 'customer', "vendor_name", "vendor_location", 'salon_service', 'vendor_service', 
            'date', 'start_time', 'end_time', 'status', 'payment_reference', 'is_rated','created_at'
        ]
        read_only_fields = ['id', 'status','is_rated', 'end_time' ]
    
    def get_vendor_name(self, obj):
        vendor_user_obj = obj.get_vendor_user()
        return vendor_user_obj.get_full_name()
    def get_vendor_location(self, obj):
        vendor_user_obj = obj.get_vendor_user()
        return vendor_user_obj.address
        

    def validate(self, data):
        salon_service = data.get('salon_service')
        vendor_service = data.get('vendor_service')
        date = data.get('date')
        start_time = data.get('start_time')
        status = data.get("status")
        is_rated = data.get("is_rated")

        if not (salon_service or vendor_service):
            raise serializers.ValidationError("You must select a service.")
        if salon_service and vendor_service:
            raise serializers.ValidationError("Select either a salon or a vendor service, not both.")

        if date < timezone.now().date():
            raise serializers.ValidationError("You cannot book an appointment in the past.")
        
        if status:
            raise serializers.ValidationError("you cannot insert status manually")
        if is_rated:
            raise serializers.ValidationError("you cannot insert this field manually")

        service = salon_service or vendor_service
        start_datetime = datetime.combine(date, start_time)
        end_datetime = start_datetime + timedelta(minutes=service.duration_minutes)
        calculated_end_time = end_datetime.time()
        
        self.calculated_end_time = calculated_end_time

        provider = salon_service.salon if salon_service else vendor_service.vendor
        
        overlapping_bookings = Booking.objects.filter(
            date=date,
            status__in=['pending', 'confirmed'],
            start_time__lt=calculated_end_time,
            end_time__gt=start_time
        ).exclude(id=self.instance.id if self.instance else None)

        if salon_service:
            overlapping_bookings = overlapping_bookings.filter(salon_service__salon=provider)
            capacity = 1 
        else:
            overlapping_bookings = overlapping_bookings.filter(vendor_service__vendor=provider)
            capacity = 1

        if overlapping_bookings.count() >= capacity:
            raise serializers.ValidationError("This time slot is no longer available.")

        return data

    @transaction.atomic
    def create(self, validated_data):
        validated_data['end_time'] = self.calculated_end_time
        

        return super().create(validated_data)
    
    
class BookingDetailSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    
    # Salon booking details
    salon_name = serializers.CharField(source='salon_service.salon.name', read_only=True, allow_null=True)
    salon_address = serializers.CharField(source='salon_service.salon.address', read_only=True, allow_null=True)
    service_name = serializers.CharField(source='salon_service.name', read_only=True, allow_null=True)
    
    # Vendor booking details
    vendor_name = serializers.CharField(source='vendor_service.vendor.worker.username', read_only=True, allow_null=True)
    vendor_service_name = serializers.CharField(source='vendor_service.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Booking
        fields = ["customer_name", "salon_name", "salon_address", "service_name", "vendor_name", "vendor_service_name"]

class VerifyNinSerializer(serializers.Serializer):
    """
    Validate Vendors VNIN
    """
    vnin = serializers.CharField(required=True, write_only=True, help_text="Enter virtual nin; to generate input : *346*3*Your_NIN*715461# or visit nimc mobile app and generate vnin using this enterprise code {715461}")
    def validate_nin(self, value):
        value = value.strip()
        
        if not value:
            raise serializers.ValidationError("please enter vNIN")

        if len(value) != 16:
            raise serializers.ValidationError("vNIN must be exactly 16 digits")

        return value