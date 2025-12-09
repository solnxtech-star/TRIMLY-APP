from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import SalonProfile, SalonServices
from .serializers import SalonProfileSerializer, SalonServicesSerializer
from api.v1.Users import permissions
#check for permisions to update or delet the corect slaon ownerr

class SalonViewset(viewsets.ModelViewSet):
    queryset = SalonProfile.objects.all()
    serializer_class = SalonProfileSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            permission_classes = [permissions.IsAdminOrSalonOwner]
        else:
            permission_classes = [permissions.IsAdminOrSalonOwnerObject]
        return [permission() for permission in permission_classes]
    def perform_create(self, serializer):
        return serializer.save(owner=self.request.user)
  
class SalonServicesListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SalonServicesSerializer

    def get_queryset(self):
        salon_id = self.kwargs["id"]
        return SalonServices.objects.filter(salon=salon_id)
    def perform_create(self, serializer):
        salon_id = self.kwargs["id"]
        serializer.save(salon__id=salon_id)
    def get_permissions(self):
        if self.request.method == "GET":
            permission_classes = [AllowAny]
        else:
            permission_classes = [permissions.IsAdminOrSalonOwner]
        return [permission() for permission in permission_classes]
    
class SalonServicesRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalonServices.objects.all()
    serializer_class = SalonServices
    permission_classes = [permissions.IsAdminOrSalonServiceOwnerObject]
    