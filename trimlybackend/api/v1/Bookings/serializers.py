from .models import Booking
from rest_framework import serializers

from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Booking

from datetime import datetime, timedelta
from django.utils import timezone
from django.db import transaction
from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    # --- Existing Read-Only Fields ---
    customer_address = serializers.ReadOnlyField(source='customer.customer_profile.customer_address')
    customer_name = serializers.ReadOnlyField(source="customer.get_full_name")
    customer_image = serializers.ReadOnlyField(source="customer.customer_profile.profile_pic.url")
    vendor_service_name = serializers.ReadOnlyField(source="get_vendor_service_name")

    # --- Decoupled Profile IDs (Crucial for Frontend Review Routing) ---
    vendor_id = serializers.ReadOnlyField(source='vendor_service.vendor.id')
    salon_id = serializers.ReadOnlyField(source='salon_service.salon.id')

    # --- Context-Aware Display Fields ---
    # Automatically pulls business name or individual provider name
    provider_name = serializers.SerializerMethodField()
    provider_image = serializers.SerializerMethodField()
    provider_location = serializers.SerializerMethodField()

    amount = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'customer_id', 'customer_name', 'customer_address', 
            'vendor_id', 'salon_id', 'customer_image', 
            'salon_service', 'vendor_service', 'amount', 'duration', 
            'provider_name', 'provider_image', 'provider_location', 'vendor_service_name', 
            'date', 'start_time', 'end_time', 'status', 'payment_reference', 
            'is_rated', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'is_rated', 'end_time', 'amount', 'duration']

    def get_provider_name(self, obj):
        if obj.vendor_service:
            return obj.vendor_service.vendor.worker.get_full_name()
        return obj.salon_service.salon.name

    def get_provider_image(self, obj):
        if obj.vendor_service and obj.vendor_service.vendor.profile_pic:
            return obj.vendor_service.vendor.profile_pic.url
        if obj.salon_service and obj.salon_service.salon.logo:  # adjust key matching salon profile setup
            return obj.salon_service.salon.logo.url
        return None

    def get_provider_location(self, obj):
        if obj.vendor_service:
            return obj.vendor_service.vendor.address
        return obj.salon_service.salon.address

    def get_amount(self, obj):
        service = obj.salon_service or obj.vendor_service
        return getattr(service, 'price', 0) if service else 0

    def get_duration(self, obj):
        service = obj.salon_service or obj.vendor_service
        return getattr(service, 'duration_minutes', 0) if service else 0

    # ... keep your validate() and create() logic completely identical ...
    def validate(self, data):
        salon_service = data.get('salon_service')
        vendor_service = data.get('vendor_service')
        date = data.get('date')
        start_time = data.get('start_time')
        status = data.get("status")
        is_rated = data.get("is_rated")

        # 1. Service Selection Logic
        if not (salon_service or vendor_service):
            raise serializers.ValidationError("You must select a service.")
        if salon_service and vendor_service:
            raise serializers.ValidationError("Select either a salon or a vendor service, not both.")

        # 2. Date/Time Validation
        if date < timezone.now().date():
            raise serializers.ValidationError("You cannot book an appointment in the past.")
        
        if status or is_rated:
            raise serializers.ValidationError("You cannot set status or rating manually.")

        # 3. Calculate End Time (Stored for use in create())
        service = salon_service or vendor_service
        start_datetime = datetime.combine(date, start_time)
        end_datetime = start_datetime + timedelta(minutes=service.duration_minutes)
        self.calculated_end_time = end_datetime.time()

        # 4. Conflict/Capacity Check
        provider = salon_service.salon if salon_service else vendor_service.vendor
        
        overlapping_bookings = Booking.objects.filter(
            date=date,
            status__in=['pending', 'confirmed'],
            start_time__lt=self.calculated_end_time,
            end_time__gt=start_time
        ).exclude(id=self.instance.id if self.instance else None)

        # Filter by specific provider
        if salon_service:
            overlapping_bookings = overlapping_bookings.filter(salon_service__salon=provider)
        else:
            overlapping_bookings = overlapping_bookings.filter(vendor_service__vendor=provider)

        if overlapping_bookings.count() >= 1: # Assuming capacity of 1 for now
            raise serializers.ValidationError("This time slot is no longer available.")

        return data

    @transaction.atomic
    def create(self, validated_data):
        # Apply the end_time we calculated during validation
        validated_data['end_time'] = self.calculated_end_time
        return super().create(validated_data)
    
    
# class BookingDetailSerializer(serializers.ModelSerializer):
#     customer_name = serializers.CharField(source='customer.username', read_only=True)
#     customer_address = serializers.CharField(source='customer.address', read_only=True, allow_null=True)
#     vendor_id =serializers.UUIDField(source='vendor_service.vendor.worker.id', read_only=True,)

#     # Salon booking details
#     salon_name = serializers.CharField(source='salon_service.salon.name', read_only=True, allow_null=True)
#     salon_address = serializers.CharField(source='salon_service.salon.address', read_only=True, allow_null=True)
#     service_name = serializers.CharField(source='salon_service.name', read_only=True, allow_null=True)
    
#     # Vendor booking details
#     vendor_id =serializers.UUIDField(source='vendor_service.vendor.worker.id', read_only=True,)
#     vendor_name = serializers.CharField(source='vendor_service.vendor.worker.username', read_only=True, allow_null=True)
#     vendor_service_name = serializers.CharField(source='vendor_service.name', read_only=True, allow_null=True)
#     customer_image = serializers.ReadOnlyField(source="customer.customer_profile.profile_pic.url")
    
#     class Meta:
#         model = Booking
#         fields = ["customer_name", "customer_address", "customer_image", "salon_name", "salon_address", "service_name", "vendor_id", "vendor_name", "vendor_service_name"]

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
    
from datetime import datetime
from rest_framework import serializers
from .models import Booking

from datetime import datetime
from rest_framework import serializers
from .models import Booking

class BookingRescheduleSerializer(serializers.ModelSerializer):
    # Change the field name here to match the model perfectly
    date = serializers.DateField()  
    start_time = serializers.CharField()  
    end_time = serializers.CharField()    

    class Meta:
        model = Booking
        # Update the fields list to include 'date' instead of 'booking_date'
        fields = ["date", "start_time", "end_time"]

    def validate(self, attrs):
        new_date = attrs.get("date")
        
        def parse_time_field(time_input):
            if not time_input:
                return None
            if "T" in time_input or "Z" in time_input:
                time_str = time_input.split("T")[-1].replace("Z", "").split(".")[0]
                return datetime.strptime(time_str, "%H:%M:%S").time()
            try:
                return datetime.strptime(time_input, "%H:%M:%S").time()
            except ValueError:
                return datetime.strptime(time_input, "%H:%M").time()

        new_start = parse_time_field(attrs.get("start_time"))
        new_end = parse_time_field(attrs.get("end_time"))

        if not new_date:
            new_date = self.instance.date
        if not new_start:
            new_start = self.instance.start_time
        if not new_end:
            new_end = self.instance.end_time

        attrs["start_time"] = new_start
        attrs["end_time"] = new_end

        if new_start >= new_end:
            raise serializers.ValidationError(
                {"start_time": "The appointment start time must occur distinctly before the end time."}
            )

        duplicate_query = Booking.objects.filter(
            date=new_date,
            status="confirmed",
            start_time__lt=new_end,
            end_time__gt=new_start
        ).exclude(id=self.instance.id)

        if self.instance.vendor_service:
            duplicate_query = duplicate_query.filter(vendor_service__vendor=self.instance.vendor_service.vendor)
        elif self.instance.salon_service:
            duplicate_query = duplicate_query.filter(salon_service__salon=self.instance.salon_service.salon)

        if duplicate_query.exists():
            raise serializers.ValidationError(
                {"date": "The selected time slot is already occupied by another client."}
            )

        return attrs