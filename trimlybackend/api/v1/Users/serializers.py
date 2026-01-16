from rest_framework import serializers
from api.v1.Vendor.models import IndividualVendorProfile
from .models import User
from api.v1.Salons.models import SalonOwnerProfile
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.db import transaction
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import LoginSerializer


User = get_user_model()


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
        fields = ("id", "first_name", "last_name", "email", "username", "phone_number", "role", "salon_profile", "vendor_profile")
        read_only_fields = ["id", "email", "role"]
    
    @transaction.atomic
    def update(self, instance, validated_data):
        def update_or_create_profile(profile_data, profile_model):
            if profile_data is not None:
                profile, created = profile_model.objects.update_or_create(
                    user=instance,
                    defaults=profile_data
                )
        
        salon_data = validated_data.pop("salon_profile", None)
        vendor_data = validated_data.pop("vendor_profile", None)
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
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    def get_fields(self):
        """Remove username field from schema and form"""
        fields = super().get_fields()
        fields.pop('username', None)
        return fields

    def validate(self, data):
        """Set username to email for allauth compatibility"""
        data['username'] = data.get('email', '')
        data = super().validate(data)
        return data

    def validate_role(self, value):
        """Prevent admin role assignment, default to customer"""
        if value == "ADMIN":
            return "CUSTOMER"
        return value

    @transaction.atomic
    def save(self, request):
        """Save user with role and phone_number"""
        # Ensure username is set before calling super
        if 'username' not in self.validated_data:
            self.validated_data['username'] = self.validated_data['email']
            
        user = super().save(request)
        
        user.role = self.validated_data.get("role")
        user.phone_number = self.validated_data.get("phone_number", "")
        user.save(update_fields=["role", "phone_number"])
        
        return user


class EmailLoginSerializer(LoginSerializer):
    email = serializers.EmailField(required=True, allow_blank=False)
    
    def get_fields(self):
        """Remove username field from schema and form"""
        fields = super().get_fields()
        fields.pop('username', None)
        return fields
    
    def validate(self, attrs):
        """Map email to username for authentication backend"""
        attrs['username'] = attrs.get('email')
        return super().validate(attrs)
    
class WithdrawalRequestSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=500.00)