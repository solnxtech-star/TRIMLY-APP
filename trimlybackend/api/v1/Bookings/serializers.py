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
    end_time = serializers.TimeField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'salon_service', 'vendor_service', 
            'date', 'start_time', 'end_time', 'status'
        ]

    def validate(self, data):
        salon_service = data.get('salon_service')
        vendor_service = data.get('vendor_service')
        date = data.get('date')
        start_time = data.get('start_time')

        if not (salon_service or vendor_service):
            raise serializers.ValidationError("You must select a service.")
        if salon_service and vendor_service:
            raise serializers.ValidationError("Select either a salon or a vendor service, not both.")

        if date < timezone.now().date():
            raise serializers.ValidationError("You cannot book an appointment in the past.")

        service = salon_service or vendor_service
        start_datetime = datetime.combine(date, start_time)
        end_datetime = start_datetime + timedelta(minutes=service.duration)
        calculated_end_time = end_datetime.time()
        
        # --- CHANGE HERE ---
        # Do NOT put end_time in the data dict if it is read_only. 
        # Instead, store it as a temporary attribute on the serializer instance.
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
        # Manually inject the end_time that we calculated in the validate method
        validated_data['end_time'] = self.calculated_end_time
        
        # Now call super().create which will successfully return the object
        return super().create(validated_data)