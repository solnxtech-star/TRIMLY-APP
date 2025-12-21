from datetime import datetime
from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from api.v1.Category.serializers import AvailabilityExceptionSerializer, GallerySerializer, AvailaibilitySerializer
from api.v1.Bookings.utils import get_available_slots
from .models import SalonProfile, SalonServices
from api.v1.Category.models import AvailabilityException, Gallery, Availability
from .serializers import SalonProfileSerializer, SalonServicesSerializer
from api.v1.Users import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
#check for permisions to update or delet the corect slaon ownerr

class SalonViewset(viewsets.ModelViewSet):
    """"
    A viewset for viewing and editing salon instances."""
    queryset = SalonProfile.objects.all()
    serializer_class = SalonProfileSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [permissions.IsAdminOrSalonOwner]
        else:
            permission_classes = [permissions.IsAdminOrSalonOwnerObject]
        return [permission() for permission in permission_classes]
    def perform_create(self, serializer):
        return serializer.save(owner=self.request.user)
  
class SalonServicesListCreateAPIView(generics.ListCreateAPIView):
    """
    Instantiates and Return Salon Services
    """
    serializer_class = SalonServicesSerializer

    def get_queryset(self):
        salon_id = self.kwargs["id"]
        return SalonServices.objects.filter(salon_id=salon_id)
    def perform_create(self, serializer):
        salon = get_object_or_404(SalonProfile, id = self.kwargs["id"])
        serializer.save(salon=salon)
        
    def get_permissions(self):
        if self.request.method == "GET":
            permission_classes = [AllowAny]
        else:
            permission_classes = [permissions.IsAdminOrSalonOwner]
        return [permission() for permission in permission_classes]
    
class SalonServicesRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
   Retrieves Salon Services objects(Id)
    """
    queryset = SalonServices.objects.all()
    serializer_class = SalonServicesSerializer
    permission_classes = [permissions.IsAdminOrSalonServiceOwnerObject]
    def get_queryset(self):
        return SalonServices.objects.filter(
            salon_id=self.kwargs["salon_id"]
        )

class SalonGalleryUploadAPIView(generics.ListCreateAPIView):
    """
    Handle Salon Gallery and Portfolio
    """
    serializer_class = GallerySerializer

    def get_queryset(self):
        return Gallery.objects.filter(salon_id=self.kwargs["id"])

    def perform_create(self, serializer):
        salon = get_object_or_404(Gallery, salon_id=self.kwargs["id"])
        serializer.save(
            salon=salon
        )
    def get_permissions(self):
        if self.request.method == "GET":
            permission_classes = [IsAuthenticated]
        else :
            permission_classes = [permissions.IsAdminOrSalonOwner]
        
        return [permission() for permission in permission_classes]
    


class SalonAvailabilityListCreateAPIView(generics.ListCreateAPIView):
    """
    Instantiates and Returns Salon Avalaibility
    """
    serializer_class = AvailaibilitySerializer

    def get_queryset(self):
        return Availability.objects.filter(
            salon_id=self.kwargs["id"]
        )

    def perform_create(self, serializer):
        serializer.save(salon_id=self.kwargs["id"])

    def get_permissions(self):
        if self.request.method == "GET":
            permission_classes = [AllowAny]
        else:
            permission_classes = [permissions.IsAdminOrSalonOwnerObject]
        return [p() for p in permission_classes]
    


class SalonAvailabilityRetrieveUpdateDeleteAPIView(
    generics.RetrieveUpdateDestroyAPIView):
    """
    Instantiates and Returns Salon Avalaibility objects(Id)
    """
    serializer_class = AvailaibilitySerializer
    permission_classes = [permissions.IsAdminOrSalonServiceOwnerObject]
    def get_queryset(self):
        qs = Availability.objects.filter(salon_id = self.kwargs["salon_id"])
        return qs


class SalonAvailabilityExceptionListCreateAPIView(generics.ListCreateAPIView):
    """
    Instantiates and Returns Salon Avalaibility Exception
    """
    serializer_class = AvailabilityExceptionSerializer
    permission_classes = [permissions.IsOwnerOfTargetProvider]

    def get_queryset(self):
        return AvailabilityException.objects.filter(
            salon_id=self.kwargs["salon_id"]
        )

    def perform_create(self, serializer):
        salon = get_object_or_404(SalonProfile, id = self.kwargs["salon_id"])
        serializer.save(salon=salon)

class SalonAvailabilityExceptionRetrieveAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Instantiates and Returns Salon Avalaibility Exception object (id)
    """
    serializer_class = AvailabilityExceptionSerializer
    permission_classes = [permissions.IsSalonAvailabilityOwner]

    def get_queryset(self):
        return AvailabilityException.objects.filter(
            salon_id=self.kwargs["salon_id"]
        )
class SalonSlotsAPIView(APIView):
    """
    Handles returning Available slots to the user
    """
    permission_classes = [AllowAny] # Customers don't need to be logged in to browse

    def get(self, request, vendor_id):
        date_str = request.query_params.get('date')
        duration = int(request.query_params.get('duration', 60)) # Default 60 mins
        
        if not date_str:
            return Response({"error": "Date is required"}, status=400)
            
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        salon = get_object_or_404(salon, id=self.kwargs["salon_id"])
        
        slots = get_available_slots(salon, date, duration)
        
        return Response({
            "salon_id": vendor_id,
            "date": date_str,
            "slots": slots
        })