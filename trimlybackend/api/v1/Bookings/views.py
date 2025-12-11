from .serializers import BookingSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics, permissions
from api.v1.Users.permissions import IsApplicationAdmin
from .models import Booking
from django.shortcuts import get_object_or_404

class BookingListCreateAPIView(generics.ListCreateAPIView):
    '''
    View for admin to perform crud  on all endpoints and for 
    all users to create a booking
    '''
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    def perform_create(self, serializer):
        return serializer.save(customer=self.request.user)
    def get_permissions(self):
        if self.request.method == "post":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsApplicationAdmin]

        return [permission() for permission in permission_classes]
        
class BookingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsApplicationAdmin]

class UserBookings(generics.ListAPIView):
    '''
    view for users to fetch all their bookings
    '''
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        queryset = Booking.objects.filter(customer=self.request.user)
        return queryset
class UserBookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    '''
    view for users to get a single booking(made by them)
    '''
    def get_queryset(self):
        queryset = get_object_or_404(Booking, id=self.kwargs["id"], customer = self.request.user)
        return queryset



    
