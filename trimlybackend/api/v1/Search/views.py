from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from django.db.models import Q, Avg, Value, FloatField
from django.db.models.functions import Coalesce
from itertools import chain
from rest_framework.response import Response
from api.v1.Salons.models import SalonProfile
from api.v1.Vendor.models import IndividualVendorProfile
from api.v1.Search.search_service import apply_geospatial_filter
from api.v1.Search.serializers import UnifiedSearchSerializer
from rest_framework.decorators import api_view
from rest_framework import status


class GlobalMarketplaceSearchAPIView(GenericAPIView):
    serializer_class = UnifiedSearchSerializer
    def get(self, request):
        query = request.query_params.get('q', '') 
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        service_id = request.query_params.get('service')
        min_rating = request.query_params.get('rating', 0)

        # 1. Base query for Salons
        salons = SalonProfile.objects.annotate(avg_rating=Avg('reviews__rating'))
        
        # 2. Base query for Individual Vendors
        vendors = IndividualVendorProfile.objects.annotate(avg_rating=Avg('reviews__rating'))

        # 3. Apply Keyword & Rating Filters
        salon_filters = (Q(name__icontains=query) | Q(about__icontains=query)) 
        vendor_filters = (Q(bio__icontains=query)) | Q(worker__username__icontains=query)
        salons = SalonProfile.objects.annotate(
        avg_rating=Coalesce(
            Avg('reviews__rating'), 
            Value(0.0), 
            output_field=FloatField()
        )
)

# 2. Fetch Vendors and force NULL ratings to be 0.0
        vendors = IndividualVendorProfile.objects.annotate(
            avg_rating=Coalesce(
                Avg('reviews__rating'), 
                Value(0.0), 
                output_field=FloatField()
            )
        )

# 3. Now your filters will work!
        salons = salons.filter(salon_filters, avg_rating__gte=min_rating)
        vendors = vendors.filter(vendor_filters, avg_rating__gte=min_rating)

# 4. Filter by Service Category if provided
        if service_id:
            salons = salons.filter(category_id=service_id)
            vendors = vendors.filter(category_id=service_id)

        # 4. CALLING HAVERSINE: If lat/lon provided, calculate distance
        if lat and lon:
            salons = apply_geospatial_filter(salons, lat, lon).filter(distance__lte=20)
            vendors = apply_geospatial_filter(vendors, lat, lon).filter(distance__lte=20)


        # 5. Combine results and sort
        combined = sorted(
            chain(salons, vendors),
            key=lambda x: getattr(x, 'distance', 999) # Closest first
        )

        serializer = UnifiedSearchSerializer(combined, many=True)
        return Response(serializer.data)
    


@api_view(['PATCH'])
def toggle_availability(request):
    user = request.user
    # Check if the user is a Salon Owner or an Individual Vendor
    if hasattr(user, 'individualvendorprofile'):
        profile = user.individualvendorprofile
        profile.is_active = not profile.is_active
        profile.save()
        return Response({"is_available": profile.is_active})
    
    elif hasattr(user, 'salonprofile'):
        profile = user.salonprofile
        profile.is_open = not profile.is_open
        profile.save()
        return Response({"is_available": profile.is_open})
    
    return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)