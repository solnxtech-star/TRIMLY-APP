from rest_framework import serializers
from api.v1.Vendor.models import IndividualVendorProfile
from .models import OTP, User, PasswordResetToken
from api.v1.Salons.models import SalonOwnerProfile
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.db import transaction
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import LoginSerializer
from api.v1.utils.otp_generator import send_otp_email
from allauth.account.models import EmailAddress
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomerProfile


User = get_user_model()


class SalonOwnerSerializer(serializers.ModelSerializer):
    salon_service = serializers.CharField()
    class Meta:
        model = SalonOwnerProfile
        exclude = ['owner']


class IndividualVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualVendorProfile
        exclude = ['worker']
class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        exclude = ['user']
        extra_kwargs = {
            'user': {'read_only': True},
            'id' : {'read_only' : True} # This stops the "already exists" validation check
        }


class UserDetailSerializer(serializers.ModelSerializer):
    salon_profile = SalonOwnerSerializer(source="salon_owner_profile", required=False)
    vendor_profile = IndividualVendorSerializer(source="individual_vendor_profile", required=False)
    customer_profile = CustomerProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "username", "phone_number", "role", "salon_profile", "vendor_profile", "customer_profile")
        read_only_fields = ["id", "email", "role"]
    
    @transaction.atomic
    def update(self, instance, validated_data):
        def update_or_create_profile(profile_data, profile_model):
            if profile_data is not None:
                # Remove 'user' from profile_data if it exists to avoid conflicts
                profile_data.pop('user', None) 
                
                profile, created = profile_model.objects.update_or_create(
                    user=instance,
                    defaults=profile_data
                )
        
        # Pop the data before calling super().update
        salon_data = validated_data.pop("salon_owner_profile", None) # Use the source name here
        vendor_data = validated_data.pop("individual_vendor_profile", None)
        customer_data = validated_data.pop("customer_profile", None)

        instance = super().update(instance, validated_data)

        if instance.role == 'salon_owner':
            update_or_create_profile(salon_data, SalonOwnerProfile)
        elif instance.role == 'individual_vendor':
            update_or_create_profile(vendor_data, IndividualVendorProfile)
        elif instance.role == 'customer':
            update_or_create_profile(customer_data, CustomerProfile)
            
        return instance
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.role == 'customer':
            ret.pop('salon_profile', None)
            ret.pop('vendor_profile', None)
        elif instance.role == 'salon_owner':
            ret.pop('vendor_profile', None)
            ret.pop('customer_profile', None)
        elif instance.role == 'individual_vendor':
            ret.pop('salon_profile', None)
            ret.pop('customer_profile', None)
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
    
    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email is already registered.")
        return email

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
        
        
        # Generate and send OTP
        otp = OTP.objects.create(
            user=user,
            code=OTP.generate_code(),
            otp_type='email_verification'
        )
        
        # Send OTP via email
        send_otp_email(user, otp.code)
        
        return user


class VerifyEmailOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    
    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        try:
            otp = OTP.objects.filter(
                user=user,
                code=data['otp'],
                otp_type='email_verification',
                is_used=False
            ).latest('created_at')
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")
        
        if not otp.is_valid():
            raise serializers.ValidationError("OTP has expired")
        
        data['user'] = user
        data['otp_object'] = otp
        return data


class RequestPasswordResetOTPSerializer(serializers.Serializer):
    """Request OTP for password reset"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        # Check if user exists (but don't reveal if they don't for security)
        self.user = User.objects.filter(email=value).first()
        return value
    
    def save(self):
        if self.user:
            # Generate OTP
            otp = OTP.objects.create(
                user=self.user,
                code=OTP.generate_code(),
                otp_type='password_reset'
            )
            
            # Send OTP via email
            send_mail(
                'Reset Your Password',
                f'Your password reset code is: {otp.code}\nThis code expires in 5 minutes.',
                "onboarding@resend.dev",
                [self.user.email],
                fail_silently=False,
            )


class VerifyPasswordResetOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    
    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        try:
            otp = OTP.objects.filter(
                user=user,
                code=data['otp'],
                otp_type='password_reset',
                is_used=False
            ).latest('created_at')
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")
        
        if not otp.is_valid():
            raise serializers.ValidationError("OTP has expired")
        reset_obj = PasswordResetToken.objects.create(user=user)
        data['reset_obj'] = str(reset_obj.token)
        return data

class ResetPasswordSerializer(serializers.Serializer):
    token_str = serializers.UUIDField()
    new_password = serializers.CharField(write_only=True, min_length=8, required=True)
    confirm_new_password = serializers.CharField(write_only=True, min_length=8, required=True)

    def validate(self, data):
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_new_password")
        if confirm_password != new_password:
            raise serializers.ValidationError("password mismatch")
        return data


class ResendOTPSerializer(serializers.Serializer):
    """Resend OTP for email verification or password reset"""
    email = serializers.EmailField()
    otp_type = serializers.ChoiceField(choices=['email_verification', 'password_reset'])
    
    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
            data['user'] = user
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        # Check if email is already verified for email_verification type
        if data['otp_type'] == 'email_verification':
            email_address = EmailAddress.objects.filter(
                user=user,
                email=user.email
            ).first()
            
            if email_address and email_address.verified:
                raise serializers.ValidationError("Email already verified")
        
        return data
    
    def save(self):
        user = self.validated_data['user']
        otp_type = self.validated_data['otp_type']
        
        # Generate new OTP
        otp = OTP.objects.create(
            user=user,
            code=OTP.generate_code(),
            otp_type=otp_type
        )
        
        # Send appropriate email
        if otp_type == 'email_verification':
            subject = 'Verify Your Email'
            message = f'Your verification code is: {otp.code}\nThis code expires in 5 minutes.'
        else:
            subject = 'Reset Your Password'
            message = f'Your password reset code is: {otp.code}\nThis code expires in 5 minutes.'
        
        send_mail(
            subject,
            message,
            'onboarding@resend.dev',
            [user.email],
            fail_silently=False,
        )

from rest_framework_simplejwt.tokens import RefreshToken # Add this import

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

    def get_auth_data(self, user):
        """Explicitly include refresh token in the JSON response"""
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user
        }
