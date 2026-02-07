from rest_framework import serializers

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
        
        def validate(self, attrs):
            salon = attrs.get("salon")
            vendor = attrs.get("vendor")
            provider = salon or vendor
            attrs["provider"] = provider
            if salon and vendor:
                raise serializers.ValidationError("can't review both salon and vendor")
            if not salon and not vendor:
                raise serializers.ValidationError("must choose a vendor to review")
            booking = Booking.objects.filter(customer=self.request.user, get_vendor_user=provider).last()
            if not booking and not booking.status:
                raise serializers.ValidationError("you're not allowed to review this vendor")
            return attrs
            
        def validate_rating(self, value):
            if value < 0 :
                raise serializers.ValidationError("can't rate below 0")
            elif value > 5:
                raise serializers.ValidationError("rating shouldnt be more than 5")
            return value
            



