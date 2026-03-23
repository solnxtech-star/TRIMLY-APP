from django.shortcuts import render
from .models import PasswordResetToken, User
from rest_framework.generics import ListAPIView,  RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from .permissions import IsApplicationAdmin
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.shortcuts import get_object_or_404
from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView
from .serializers import EmailLoginSerializer, CustomRegisterSerializer, UserDetailSerializer, ResetPasswordSerializer
from .docs.auth import login_schema, register_schema
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


class UserProfileListView(RetrieveAPIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsApplicationAdmin]


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:8000/accounts/google/login/callback/" # Must match Google Console
    client_class = OAuth2Client


class EmailLoginView(LoginView):
    serializer_class = EmailLoginSerializer


EmailLoginView = login_schema(EmailLoginView)


class EmailRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer


EmailRegisterView = register_schema(EmailRegisterView)

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from allauth.account.models import EmailAddress
from .serializers import (
    VerifyEmailOTPSerializer, 
    RequestPasswordResetOTPSerializer,
    VerifyPasswordResetOTPSerializer,
    ResendOTPSerializer
)
from drf_spectacular.utils import extend_schema, OpenApiResponse

class VerifyEmailOTPView(APIView):
    """Verify email using OTP"""
    permission_classes = [AllowAny]
    
    @extend_schema(
        request=VerifyEmailOTPSerializer,
        responses={
            200: OpenApiResponse(description='Email verified successfully'),
            400: OpenApiResponse(description='Invalid OTP or validation error'),
        },
        description="Verify email address using the 6-digit OTP code sent to the user's email",
        tags=['auth']
    )
    def post(self, request):
        serializer = VerifyEmailOTPSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            otp = serializer.validated_data['otp_object']
            
            # Get or create EmailAddress and mark as verified
            email_address, created = EmailAddress.objects.get_or_create(
                user=user,
                email=user.email,
                defaults={'primary': True, 'verified': True}
            )
            
            if not created:
                email_address.verified = True
                email_address.save()
            
            # Mark OTP as used
            otp.is_used = True
            otp.save()
            
            return Response({
                'message': 'Email verified successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequestPasswordResetOTPView(APIView):
    """Request OTP for password reset - send OTP to email"""
    permission_classes = [AllowAny]

    @extend_schema(
        request=RequestPasswordResetOTPSerializer,
        responses={
            200: OpenApiResponse(description='Password reset OTP sent to email'),
            400: OpenApiResponse(description='Validation error'),
        },
        description="Request a password reset OTP. A 6-digit code will be sent to the provided email address if it exists.",
        tags=['auth']
    )
    def post(self, request):
        serializer = RequestPasswordResetOTPSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'If the email exists, a password reset code has been sent.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyPasswordResetOTPView(APIView):
    """Verify OTP"""
    permission_classes = [AllowAny]
    @extend_schema(
        request=VerifyPasswordResetOTPSerializer,
        responses={
            200: OpenApiResponse(description='Password reset successfully'),
            400: OpenApiResponse(description='Invalid OTP or validation error'),
        },
        description="Verify the OTP code and return a unique token",
        tags=['auth']
    )
    def post(self, request):
        serializer = VerifyPasswordResetOTPSerializer(data=request.data)
        if serializer.is_valid():
           
            reset_token = serializer.validated_data['reset_obj']
            
            return Response({
                'message': 'OTP Verified',
                "reset_token" : reset_token
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResetPasswordView(APIView):
    """change password of User After Otp has been generated"""
    permission_classes = [AllowAny]
    @extend_schema(
        request=ResetPasswordSerializer,
        responses={
            200: OpenApiResponse(description='Password reset successfully'),
            400: OpenApiResponse(description='Validation error'),
        },
        description="Reset password, input the generated token from /api/v1/auth/password/verify-otp/",
        tags=['auth']
    )

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token_str = serializer.validated_data["token_str"]
            new_password = serializer.validated_data["new_password"]
            
        try:

            reset_obj = PasswordResetToken.objects.get(token=token_str)
            if not reset_obj.is_valid():
                reset_obj.delete()
                return Response({"error": "Token expired"}, status=status.HTTP_400_BAD_REQUEST)
            user = reset_obj.user
            user.set_password(new_password)
            user.save()
            reset_obj.delete()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Invalid email"}, status=status.HTTP_400_BAD_REQUEST)
        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid reset token"}, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    """Resend OTP for email verification or password reset"""
    permission_classes = [AllowAny]
    @extend_schema(
        request=ResendOTPSerializer,
        responses={
            200: OpenApiResponse(description='OTP resent successfully'),
            400: OpenApiResponse(description='Validation error'),
        },
        description="Resend OTP code for either email verification or password reset",
        tags=['auth']
    )

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'OTP has been resent to your email'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HealthStatusView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({
            "success" : "welcome to Trimly backend api"
        })
