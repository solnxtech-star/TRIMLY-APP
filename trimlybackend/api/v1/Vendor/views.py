from datetime import datetime
from django.shortcuts import get_object_or_404
from api.v1.Category.models import Availability, AvailabilityException, Gallery
from api.v1.Category.serializers import AvailabilityExceptionSerializer, AvailaibilitySerializer, GallerySerializer
from api.v1.Reviews.models import Review
from .models import IndividualVendorProfile, VendorServices
from .serializers import SlotResponseSerializer, VendorSerializer, VendorServicesSerializer, VendorDetailSerializer
from rest_framework import generics, viewsets, permissions, parsers
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.v1.Users.permissions import IsAdminVendorOrReadOnly, IsAdminOrVendorServiceObject, IsVendorAvailabilityOwner, IsOwnerOfTargetProvider
from rest_framework.views import APIView
from rest_framework.response import Response
from api.v1.Bookings.utils import get_available_slots
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.db.models import Prefetch, Count, Avg, Value, FloatField
from django.db.models.functions import Coalesce 

class VendorServicesListCreateAPIView(generics.ListCreateAPIView):
    """
    Instantiates and Return vendor Services
    """
    serializer_class = VendorServicesSerializer
    permission_classes = [IsAdminVendorOrReadOnly]
    def get_queryset(self):
        vendor_id = self.kwargs["id"]
        return VendorServices.objects.prefetch_related("categories").filter(vendor_id=vendor_id)
    def perform_create(self, serializer):
        return serializer.save(vendor=self.request.user)

class VendorServicesRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
   Retrieves vendor Services objects(Id)
    """
    serializer_class = VendorServicesSerializer
    permission_classes = [IsAdminOrVendorServiceObject]
    def get_queryset(self):
        qs = VendorServices.objects.prefetch_related("categories").filter(vendor_id = self.kwargs["vendor_id"])

        return qs

class VendorViewset(viewsets.ModelViewSet):
    """"
    A viewset for viewing and editing vendor instances.
    """
    serializer_class = VendorSerializer
    def get_queryset(self):
        return IndividualVendorProfile.objects.select_related(
            'worker',
            'category'
        ).prefetch_related(
            Prefetch(
                'vendor_services',
                queryset=VendorServices.objects.prefetch_related('categories')
            ),
            Prefetch(
                'reviews',
                queryset=Review.objects.select_related('customer')
            ),
            'vendor_portfolio'
        ).annotate(
            review_count=Count('reviews'),
            average_rating=Coalesce(
                Avg('reviews__rating'), 
                Value(0.0), 
                output_field=FloatField()
            )
        ).order_by("-average_rating")

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAuthenticated,]
        elif self.action == "create":
            permission_classes = [IsAdminVendorOrReadOnly,]
        else:
            permission_classes = [IsAdminOrVendorServiceObject,]

        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == "retrieve":
            return VendorDetailSerializer
        else:
            return VendorSerializer
    def perform_create(self, serializer):
        # Automatically set the 'worker' field to the current authenticated user instance
        serializer.save(worker=self.request.user)

    
class VendorGalleryUploadAPIView(generics.ListCreateAPIView):
    """
    Handle vendor Gallery and Portfolio
    """
    serializer_class = GallerySerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get_queryset(self):
        return Gallery.objects.filter(vendor_id=self.kwargs["id"])

    def perform_create(self, serializer):
        vendor = get_object_or_404(IndividualVendorProfile, worker_id=self.kwargs["id"])
        serializer.save(
            vendor=vendor
        )
    def get_permissions(self):
        if self.request.method == "GET":
            permission_classes = [IsAuthenticated]
        else :
            permission_classes = [IsAdminVendorOrReadOnly]
        
        return [permission() for permission in permission_classes]
    
class VendorAvailabilityListCreateAPIView(generics.ListCreateAPIView):
    """
    Instantiates and Returns vendor Avalaibility
    """
    serializer_class = AvailaibilitySerializer

    def get_queryset(self):
        return Availability.objects.filter(
            vendor_id=self.kwargs["vendor_id"]
        )

    def perform_create(self, serializer):
        vendor = get_object_or_404(IndividualVendorProfile, id = self.kwargs["vendor_id"])
        serializer.save(vendor = vendor)

    def get_permissions(self):
        if self.request.method == "GET":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminVendorOrReadOnly]
        return [p() for p in permission_classes]
    


class VendorAvailabilityRetrieveUpdateDeleteAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Instantiates and Returns vendor Avalaibility objects(Id)
    """
   
    serializer_class = AvailaibilitySerializer
    permission_classes = [IsAdminOrVendorServiceObject]
    def get_queryset(self):
        qs = Availability.objects.filter(vendor_id = self.kwargs["vendor_id"])
        return qs

class VendorAvailabilityExceptionListCreateAPIView(generics.ListCreateAPIView):
    """
    Instantiates and Returns vendor Avalaibility Exception
    """
    serializer_class = AvailabilityExceptionSerializer
    permission_classes = [IsOwnerOfTargetProvider]

    def get_queryset(self):
        return AvailabilityException.objects.filter(
            vendor_id=self.kwargs["vendor_id"]
        )

    def perform_create(self, serializer):
        vendor = get_object_or_404(IndividualVendorProfile, id = self.kwargs["id"])
        serializer.save(vendor = vendor)


class VendorAvailabilityExceptionRetrieveAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Instantiates and Returns Vendor Avalaibility Exception object (id)
    """    
    serializer_class = AvailabilityExceptionSerializer
    permission_classes = [IsVendorAvailabilityOwner]

    def get_queryset(self):
        return AvailabilityException.objects.filter(
            vendor_id=self.kwargs["vendor_id"]
        )



class VendorSlotsAPIView(APIView):
    """
    Handles returning Available slots to the user
    """
    permission_classes = [AllowAny] # Customers don't need to be logged in to browse
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='date', 
                description='Date to check availability (YYYY-MM-DD)', 
                required=True, 
                type=OpenApiTypes.DATE
            ),
            OpenApiParameter(
                name='duration', 
                description='enter duration for slot', 
                required=False, 
                type=OpenApiTypes.INT
            ),
        ],
        responses={200: SlotResponseSerializer(many=True)})

    def get(self, request, vendor_id):
        date_str = request.query_params.get('date')
        duration = int(request.query_params.get('duration', 60)) # Default 60 mins
        
        if not date_str:
            return Response({"error": "Date is required"}, status=400)
            
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        vendor = get_object_or_404(IndividualVendorProfile, id=vendor_id)
        
        slots = get_available_slots(vendor, date, duration)
        
        return Response({
            "vendor_id": vendor_id,
            "date": date_str,
            "slots": slots
        })