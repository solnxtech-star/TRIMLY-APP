from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from api.v1.Search.search_service import apply_geospatial_filter
from api.v1.Search.serializers import MarketplaceSearchSerializer
from rest_framework.decorators import api_view
from rest_framework import status
from .models import MarketplaceSearch
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

class GlobalMarketplaceSearchAPIView(GenericAPIView):
    serializer_class = MarketplaceSearchSerializer
    @extend_schema(
        parameters=[
            OpenApiParameter(name='q', description='Search text', required=False, type=OpenApiTypes.STR),
            OpenApiParameter(name='lat', description='Latitude', required=False, type=OpenApiTypes.FLOAT),
            OpenApiParameter(name='lon', description='Longitude', required=False, type=OpenApiTypes.FLOAT),
            OpenApiParameter(name='service', description='Category ID', required=False, type=OpenApiTypes.INT),
            OpenApiParameter(name='rating', description='Minimum rating', required=False, type=OpenApiTypes.FLOAT),
        ]
    )

    def get(self, request):
        # 1. Capture Inputs
        query = request.query_params.get('q', '') 
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        category_id = request.query_params.get('service')
        min_rating = request.query_params.get('rating', 0)

        # 2. Base QuerySet on the View
        results = MarketplaceSearch.objects.all()

        # 3. Filtering Logic (Database Level)
        if query:
            results = results.filter(search_text__icontains=query)
        
        if category_id:
            results = results.filter(category_id=category_id)
            
        if min_rating:
            results = results.filter(avg_rating__gte=float(min_rating))

        # 4. Geospatial Logic (PostGIS sorting)
        if lat and lon:
            try:
                results = apply_geospatial_filter(results, lat, lon)
            except (ValueError, TypeError):
                pass 
        else:
            results = results.order_by('-avg_rating') # Default: Top Rated first

        # 5. Paginate and Return
        page = self.paginate_queryset(results)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(results, many=True)
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