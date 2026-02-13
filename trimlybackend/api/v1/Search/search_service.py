from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point

def apply_geospatial_filter(queryset, user_lat, user_lon):
   if user_lat and user_lon:
        user_loc = Point(user_lon, user_lat, srid=4326)
        queryset = queryset.objects.annotate(
        dist=Distance("location", user_loc)
        ).filter(distance__lte=10000).order_by('dist')
        
        return queryset