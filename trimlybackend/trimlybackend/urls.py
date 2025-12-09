"""
URL configuration for trimlybackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from dj_rest_auth.views import PasswordResetConfirmView
from dj_rest_auth.registration.views import VerifyEmailView, RegisterView 
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
urlpatterns = [
    path('admin/', admin.site.urls),
    # Enables: Login, Logout, Password Reset, and User Details
    path('api/v1/auth/users/<int:pk>/', include('api.v1.Users.urls')),
    path('api/v1/auth/', include('dj_rest_auth.urls')),
    re_path(r'^api/v1/auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$', VerifyEmailView.as_view(), name='account_confirm_email',),
    re_path(r'^api/v1/auth/password/reset/confirm/(?P<uid>[-:\w]+)/(?P<token>[-:\w]+)/$',PasswordResetConfirmView.as_view(),name='password_reset_confirm') ,# This specific name MUST match the error message!
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/v1/', include('api.v1.Salons.urls')),
    path('api/v1/', include('api.v1.Vendor.urls')),
    path('api/v1/', include('api.v1.Category.urls')),
    path('swagger/', SpectacularSwaggerView.as_view(), name="schema"),
    path('swagger-schema/', SpectacularAPIView.as_view(), name="schema")
]


