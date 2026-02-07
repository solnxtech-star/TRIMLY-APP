from rest_framework import generics, permissions, viewsets, serializers
from api.v1.Bookings.models import Booking
from api.v1.Reviews.models import Review
from api.v1.Reviews.serializers import ReviewSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q
class ReviewViewset(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Review.objects.select_related("customer", "vendor", "salon").all()
        salon_id = self.request.query_params.get('salonId')
        vendor_id = self.request.query_params.get('vendorId')

        # 3. Apply filters if the params exist
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        elif vendor_id:
            queryset = queryset.filter(vendor_id=vendor_id)
        if user.role == "salon_owner" :
            return Review.objects.filter(salon__owner=user)
        
        # 2. If the user is a Vendor, show only their reviews
        if user.role == "individual_vendor":
            return Review.objects.filter(vendor__worker=user)
        else: 
            return queryset

  
        
    def get_permissions(self):
        if self.action in ["CREATE"]:
            self.permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        if self.action in ["DELETE", "UPDATE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
        provider = serializer.validated_data["salon"] or serializer.validated_data["vendor"]
        associated_booking = Booking.objects.filter(customer=self.request.user).last()
        if associated_booking:
            associated_booking.get_vendor_user == provider or associated_booking.get_vendor_user == provider
            associated_booking.status = True
            associated_booking.save()
        else: 
            raise serializers.ValidationError({"detail" : "no associated booking"})
        
            
        

        
