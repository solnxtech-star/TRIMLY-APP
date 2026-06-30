from datetime import datetime
from django.shortcuts import render
from rest_framework import viewsets, generics, parsers
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from api.v1.Category.serializers import AvailabilityExceptionSerializer, GalleryPostSerializer, IndividualAvailabilityDaySerializer
from api.v1.Bookings.utils import get_available_slots
from api.v1.Reviews.models import Review
from .models import SalonProfile, SalonServices
from api.v1.Category.models import AvailabilityException, GalleryPost, Availability
from .serializers import SalonProfileSerializer, SalonServicesSerializer, SalonDetailSerializer,SlotResponseSerializer
from api.v1.Users import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Prefetch, Count, Avg, Value, FloatField
from django.db.models.functions import Coalesce 
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

#check for permisions to update or delet the corect slaon ownerr

class SalonViewset(viewsets.ModelViewSet):
    """"
    A viewset for viewing and editing salon instances."""

    serializer_class = SalonProfileSerializer
    

    def get_queryset(self):
        return SalonProfile.objects.select_related(
            'owner',
            'category'
        ).prefetch_related(
            Prefetch(
                'salon_services',
                queryset=SalonServices.objects.prefetch_related('categories')
            ),
            Prefetch(
                'reviews',
                queryset=Review.objects.select_related('customer')
            ),
            'salon_gallery_posts'
        ).annotate(
            review_count=Count('reviews'),
            average_rating=Coalesce(
                Avg('reviews__rating'), 
                Value(0.0), 
                output_field=FloatField()
            )
        ).order_by("-average_rating")
    
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
    def get_serializer_class(self):
        if self.action == "retrieve":
            return SalonDetailSerializer
        else:
            return SalonProfileSerializer
  
class SalonServicesListCreateAPIView(generics.ListCreateAPIView):
    """
    Instantiates and Return Salon Services
    """
    serializer_class = SalonServicesSerializer

    def get_queryset(self):
        salon_id = self.kwargs["id"]
        return SalonServices.objects.prefetch_related("categories").filter(salon_id=salon_id)
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
    serializer_class = GalleryPostSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def get_queryset(self):
        return GalleryPostSerializer.objects.select_related("salon").filter(salon_id=self.kwargs["salon_id"])

    def perform_create(self, serializer):
        salon = get_object_or_404(SalonProfile, salon_id=self.kwargs["salon_id"])
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
    serializer_class = IndividualAvailabilityDaySerializer
    permission_classes = [permissions.IsOwnerOfTargetProvider]

    def get_queryset(self):
        return Availability.objects.filter(
            salon_id=self.kwargs["id"]
        )

    def perform_create(self, serializer):
        serializer.save(salon_id=self.kwargs["id"])

    


class SalonAvailabilityRetrieveUpdateDeleteAPIView(
    generics.RetrieveUpdateDestroyAPIView):
    """
    Instantiates and Returns Salon Avalaibility objects(Id)
    """
    serializer_class = IndividualAvailabilityDaySerializer
    permission_classes = [permissions.IsAdminOrSalonOwnerObject]
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
    permission_classes = [permissions.IsSalonAvailabilityOwnerObj]

    def get_queryset(self):
        return AvailabilityException.objects.filter(
            salon_id=self.kwargs["salon_id"]
        )
class SalonSlotsAPIView(APIView):
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
    

    def get(self, request, salon_id, *args, **kwargs):
        date_str = request.query_params.get('date')
        duration = int(request.query_params.get('duration', 60))
        if not date_str:
            return Response({"error": "Date is required"}, status=400)
            
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        salon = get_object_or_404(SalonProfile, id=self.kwargs["salon_id"])
        
        slots = get_available_slots(salon, date, duration)
        
        return Response({
            "salon_id": salon_id,
            "date": date_str,
            "slots": slots
        })
    