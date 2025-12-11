from .models import IndividualVendorProfile, VendorServices
from .serializers import VendorSerializer, VendorServicesSerializer
from rest_framework import generics, viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.v1.Users.permissions import IsAdminVendorOrReadOnly, IsAdminOrVendorServiceObject

class VendorServicesListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = VendorServicesSerializer
    permission_classes = [IsAdminVendorOrReadOnly]
    def get_queryset(self):
        vendor_id = self.kwargs["id"]
        return VendorServices.objects.filter(worker__id=vendor_id)
    def perform_create(self, serializer):
        return serializer.save(vendor=self.request.user)

class VendorServicesRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VendorServices.objects.all()
    serializer_class = VendorServicesSerializer
    permission_classes = [IsAdminOrVendorServiceObject]

class VendorViewset(viewsets.ModelViewSet):
    queryset = IndividualVendorProfile.objects.all()
    serializer_class = VendorSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAuthenticated,]
        elif self.action == "create":
            permission_classes = [IsAdminVendorOrReadOnly,]
        else:
            permission_classes = [IsAdminOrVendorServiceObject,]

        return [permission() for permission in permission_classes]