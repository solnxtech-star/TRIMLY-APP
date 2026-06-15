from datetime import datetime
from django.http import Http404
from django.shortcuts import get_object_or_404
from api.v1.Category.models import Availability, AvailabilityException, GalleryPost
from api.v1.Category.serializers import AvailabilityExceptionSerializer, BulkAvailabilitySerializer , GalleryPostSerializer, IndividualAvailabilityDaySerializer
from api.v1.Reviews.models import Review
from .models import IndividualVendorProfile, VendorServices
from .serializers import SlotResponseSerializer, VendorSerializer, VendorServicesSerializer, VendorDetailSerializer
from rest_framework import generics, viewsets, permissions, parsers,status
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.v1.Users.permissions import IsAdminVendorOrReadOnly, IsAdminOrVendorServiceObject, IsVendorAvailabilityOwner, IsOwnerOfTargetProvider
from rest_framework.views import APIView
from rest_framework.response import Response
from api.v1.Bookings.utils import get_available_slots
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.db.models import Q, Prefetch, Count, Avg, Value, FloatField
from django.db.models.functions import Coalesce 
from rest_framework import generics, status
from django.db import transaction

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
        return serializer.save(vendor=self.request.user.individual_vendor_profile)
    
class VendorServicesRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
   Retrieves vendor Services objects(Id)
    """
    serializer_class = VendorServicesSerializer
    permission_classes = [IsAdminOrVendorServiceObject]
    def get_queryset(self):
        qs = VendorServices.objects.prefetch_related("categories").filter(vendor_id = self.kwargs["vendor_id"])
        return qs
    def get_object(self):
        """
        Retrieves the specific service instance by its own ID.
        Raises a 404 error if the service does not exist or doesn't match the vendor.
        """
        queryset = self.get_queryset()
        service_id = self.kwargs.get("id")  # Matches <uuid:id> from your path
        
        try:
            return queryset.get(id=service_id)
        except VendorServices.DoesNotExist:
            return ("No service found matching the given IDs.")


from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter


# FORCE SWAGGER TO SHOW THE CATEGORIES FILTER
@extend_schema_view(
    list=extend_schema(
        summary="List all vendors with multi-category filtering",
        description="Fetch all vendors. You can pass a comma-separated list of category UUIDs to filter results.",
        parameters=[
            OpenApiParameter(
                name='categories',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description="Comma-separated category IDs. Example: `8b4c2e6d-...,1a2b3c4d-...`"
            )
        ]
    )
)
class VendorViewset(viewsets.ModelViewSet):
    """"
    A viewset for viewing and editing vendor instances with multi-category filters.
    """
    serializer_class = VendorSerializer

    def get_queryset(self):
        queryset = IndividualVendorProfile.objects.select_related(
            'worker'
        ).prefetch_related(
            'categories', 
            Prefetch(
                'vendor_services',
                queryset=VendorServices.objects.prefetch_related('categories')
            ),
            Prefetch(
                'reviews',
                queryset=Review.objects.select_related('customer')
            ),
            'vendor_gallery_posts' 
        ).annotate(
            review_count=Count('reviews'),
            average_rating=Coalesce(
                Avg('reviews__rating'), 
                Value(0.0), 
                output_field=FloatField()
            )
        ).order_by("-average_rating")

        categories_param = self.request.query_params.get("categories")
        if categories_param:
            category_ids = [cat_id.strip() for cat_id in categories_param.split(",") if cat_id.strip()]
            if category_ids:
                queryset = queryset.filter(categories__id__in=category_ids).distinct()

        return queryset

    # ... keep your get_permissions, get_serializer_class, and perform_create layout the same

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAuthenticated]
        elif self.action == "create":
            permission_classes = [IsAdminVendorOrReadOnly]
        else:
            permission_classes = [IsAdminOrVendorServiceObject]

        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == "retrieve":
            return VendorDetailSerializer
        else:
            return VendorSerializer

    def perform_create(self, serializer):
        serializer.save(worker=self.request.user)

    
class VendorGalleryUploadAPIView(generics.ListCreateAPIView):
    """
    Handle uploading multiple portfolio images at once and listing them.
    Supports lookups by either Profile ID or User ID (worker_id).
    """
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    serializer_class = GalleryPostSerializer

    def get_queryset(self):
        # We also apply a dual filter here to ensure both listing 
        # and uploading remain unified.
        vendor_id = self.kwargs["id"]
        return GalleryPost.objects.filter(
            Q(vendor_id=vendor_id) | Q(vendor__worker_id=vendor_id)
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == "POST":
            vendor_id = self.kwargs["id"]
            
            # ROBUST LOOKUP: Look for a match in either 'pk' or 'worker_id'
            vendor_profile = IndividualVendorProfile.objects.filter(
                Q(pk=vendor_id) | Q(worker_id=vendor_id)
            ).first()
            
            if not vendor_profile:
                raise Http404("No IndividualVendorProfile matches the given query.")
                
            # Pass the profile down safely to the bulk engine
            context["vendor"] = vendor_profile
            
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instances = serializer.save()
        
        # Respond back with the list of created image items serialized cleanly
        response_serializer = GalleryPostSerializer(instances, many=True)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class VendorAvailabilityListCreateAPIView(generics.ListCreateAPIView):
    """
    Returns or updates/instantiates the complete weekly recurring availability matrix for a vendor.
    """
    permission_classes = [IsAdminVendorOrReadOnly]

    def get_serializer_class(self):
        # Use bulk writer for POST operations, standard serialization for listing GET arrays
        if self.request.method == "POST":
            return BulkAvailabilitySerializer
        return IndividualAvailabilityDaySerializer

    def get_queryset(self):
        return Availability.objects.filter(vendor_id=self.kwargs["vendor_id"])

    def get_serializer_context(self):
        """
        Pass the vendor database object directly into serializer processing context
        """
        context = super().get_serializer_context()
        if self.request.method == "POST":
            context["vendor"] = get_object_or_404(IndividualVendorProfile, id=self.kwargs["vendor_id"])
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Execute the transaction creation routine
        instances = serializer.save()
        
        # Return the created items utilizing our read-only layout out of the list matrix
        response_serializer = IndividualAvailabilityDaySerializer(instances, many=True)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    


class VendorAvailabilitySyncAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Fetches the entire weekly calendar list for this vendor.
    PUT/PATCH: Replaces/Syncs the entire calendar matrix safely for the vendor.
    DELETE: Wipes out the recurring weekly schedule entirely.
    """
    serializer_class = BulkAvailabilitySerializer
    permission_classes = [IsAdminOrVendorServiceObject]

    def get_queryset(self):
        return Availability.objects.filter(vendor_id=self.kwargs["vendor_id"])

    def retrieve(self, request, *args, **kwargs):
        # Instead of returning 1 instance by pk, we return the entire list for this vendor
        queryset = self.get_queryset()
        serializer = IndividualAvailabilityDaySerializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        # We handle PUT/PATCH as an atomic 'Sync' operation
        vendor = get_object_or_404(IndividualVendorProfile, id=self.kwargs["vendor_id"])
        
        serializer = BulkAvailabilitySerializer(data=request.data, context={"vendor": vendor})
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            # 1. Wipe out the old recurring records so we don't have duplicate days/stale slots
            self.get_queryset().delete()
            
            # 2. Bulk insert the updated configurations cleanly
            instances = serializer.save()

        response_serializer = IndividualAvailabilityDaySerializer(instances, many=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        # Clear out the complete weekly matrix if they want to reset it
        queryset = self.get_queryset()
        queryset.delete()
        return Response({"detail": "Weekly schedule wiped successfully."}, status=status.HTTP_204_NO_CONTENT)




class GalleryImageDeleteAPIView(generics.DestroyAPIView):
    """
    Deletes a specific gallery image asset by its unique UUID ID.
    """
    queryset = GalleryPost.objects.all()
    serializer_class = GalleryPostSerializer
    permission_classes = [IsAdminVendorOrReadOnly] # Ensure ownership validation matches your rules
    lookup_field = "id"
    
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