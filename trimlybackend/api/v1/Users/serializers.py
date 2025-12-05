from rest_framework import serializers
from .models import User, IndividualVendorProfile, CustomerProfile
from dj_rest_auth.registration.serializers import RegisterSerializer
class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
    write_only=True,      
    required=True
    ) 
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "username", "password", "confirm_password", "phone_number", "role" )
        read_only_fields = ["id"]
        extra_kwargs = {
            "password": {"write_only": True},
          
        }




class CustomRegisterSerializer(RegisterSerializer):
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
