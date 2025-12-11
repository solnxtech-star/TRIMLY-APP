from rest_framework import serializers
from api.v1.Vendor.models import  IndividualVendorProfile
from . models import User
from api.v1.Salons.models import SalonOwnerProfile
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.db import transaction

class SalonOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        salon_service = serializers.CharField()
        model = SalonOwnerProfile
        fields = "__all__"

class IndividualVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualVendorProfile
        fields = "__all__"

class UserDetailSerializer(serializers.ModelSerializer):
    salon_profile = SalonOwnerSerializer(source="SalonOwnerProfile", required=False)
    vendor_profile = IndividualVendorSerializer(source="IndividualVendorProfile", required=False)
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "username", "phone_number", "role", "salon_profile", "vendor_profile" )
        read_only_fields = ["id"]
    
    @transaction.atomic
    def update(self, instance, validated_data):
        # Helper function to process and update nested profile data
        def update_or_create_profile(profile_data, profile_model):
            if profile_data is not None:
                profile, created = profile_model.objects.update_or_create(
                    user=instance,
                    defaults=profile_data
                )
        salon_data = validated_data.pop["salon_profile"]
        vendor_data = validated_data.pop["vendor_profile"]
        instance = super().update(instance, validated_data)

        if instance.role == 'salon_owner':
            update_or_create_profile(salon_data, SalonOwnerProfile)
        elif instance.role == 'individual_vendor':
            update_or_create_profile(vendor_data, IndividualVendorProfile)
            
        return instance
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.role == 'CUSTOMER':
            ret.pop('salon_profile', None)
            ret.pop('vendor_profile', None)
        elif instance.role == 'SALON_OWNER':
            ret.pop('vendor_profile', None)
        elif instance.role == 'INDIVIDUAL_VENDOR':
            ret.pop('salon_profile', None)
        return ret

class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    role = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    

    def validate_role(self, value):
        valid = [choice[0] for choice in User.ROLE_CHOICES]
        if value not in valid:
            raise serializers.ValidationError("Invalid user role.")
        return value

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data["role"] = self.validated_data.get("role")
        data["phone"] = self.validated_data.get("phone")
        return data

    def save(self, request):
        user = super().save(request)
        
        user.role = self.cleaned_data.get("role")
        if user.role == "admin":
            user.role = "customer"
        user.phone = self.cleaned_data.get("phone")
        user.save()
        return user

