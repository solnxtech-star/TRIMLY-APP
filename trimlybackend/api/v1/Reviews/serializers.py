from rest_framework import serializers

from api.v1.Reviews.models import Review

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = Review
        fields = ("id", "customer", "customer_name", "rating", "review", "created_at")
        read_only_fields = ("id, customer", 'created')
        
        def validate(self, attrs):
            salon = attrs.get("salon")
            vendor = attrs.get("vendor")
            if salon and vendor:
                raise serializers.ValidationError("can't review both salon and vendor")
            if not salon and not vendor:
                raise serializers.ValidationError("must choose a vendor to review")
            return attrs
            
        def validate_rating(self, value):
            if value < 0 :
                raise serializers.ValidationError("can't rate below 0")
            elif value > 5:
                raise serializers.ValidationError("rating shouldnt be more than 5")
            return value
            