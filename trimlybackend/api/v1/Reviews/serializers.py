from rest_framework import serializers
from django.db.models import Q
from api.v1.Reviews.models import Review
from api.v1.Bookings.models import Booking

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = Review
        fields = ("id", "customer", "customer_name", "vendor", "salon", "rating", "review", "created_at")
        read_only_fields = ('id', 'customer_name', 'created_at')
        extra_kwargs = {
            'customer': {'required': False, 'read_only': True}
        }

    # Moved OUT of Meta
    def validate(self, attrs):
        user = self.context['request'].user
        salon = attrs.get("salon")
        vendor = attrs.get("vendor")
        provider = salon or vendor
       
        if salon and vendor:
            raise serializers.ValidationError("Can't review both salon and vendor simultaneously.")
        if not salon and not vendor:
            raise serializers.ValidationError("Must choose a vendor or salon to review.")

        # Logic: Find the last completed booking that hasn't been rated yet
        if salon:
            booking = Booking.objects.filter(
                customer=user, 
                is_rated=False,
                status='completed' # Ensure they actually finished the appointment
            ).filter( Q(salon_service__salon=provider)).last()
        elif vendor:
            booking = Booking.objects.filter(
                customer=user, 
                is_rated=False,
                status='completed' # Ensure they actually finished the appointment
            ).filter(Q(vendor_service__vendor=provider)).last()            

        if not booking:
            raise serializers.ValidationError("No unrated completed booking found for this provider.")
            
        # Store the booking in context so perform_create can use it
        self.context['associated_booking'] = booking
        return attrs
            
    def validate_rating(self, value):
        if not (0 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 0 and 5.")
        return value
            



