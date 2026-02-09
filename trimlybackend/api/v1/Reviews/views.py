from rest_framework import generics, permissions, viewsets, serializers
from api.v1.Bookings.models import Booking
from api.v1.Reviews.models import Review
from api.v1.Reviews.serializers import ReviewSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

class ReviewViewset(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["salon", "vendor"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Review.objects.none()

        if user.role == "salon_owner":
            return Review.objects.filter(salon__owner=user)
        elif user.role == "individual_vendor":
            return Review.objects.filter(vendor__worker=user)
        
        # Customers see all reviews
        return Review.objects.all().select_related("customer", "vendor", "salon")

    def get_permissions(self):
        # Action names must be lowercase
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "customer":
            raise serializers.ValidationError("Only customers can leave reviews.")
        
        # Save review and update the booking status in one go
        booking = serializer.context.get('associated_booking')
        serializer.save(customer=user)
        
        if booking:
            booking.is_rated = True
            booking.save()

        
