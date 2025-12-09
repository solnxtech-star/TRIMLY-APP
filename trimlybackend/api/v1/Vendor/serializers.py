from .models import IndividualVendorProfile, VendorServices
from rest_framework import serializers

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualVendorProfile
        fields = "__all__"
        read_only_fields = ["worker"]
        
    
class VendorServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorServices
        fields = "__all__"
        read_only_fields = ["vendor"]
