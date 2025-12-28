from django.db.models.functions import Radians, Cos, Sin, ACos
from django.db.models import F, FloatField, ExpressionWrapper

def apply_geospatial_filter(queryset, lat, lon):
    # Math: Distance = 6371 * acos(cos(lat1)*cos(lat2)*cos(lon2-lon1) + sin(lat1)*sin(lat2))
    # 6371 is the radius of Earth in Kilometers
    distance_formula = 6371 * ACos(
        Cos(Radians(float(lat))) * Cos(Radians(F('latitude'))) *
        Cos(Radians(F('longitude')) - Radians(float(lon))) +
        Sin(Radians(float(lat))) * Sin(Radians(F('latitude')))
    )
    return queryset.annotate(
        distance=ExpressionWrapper(distance_formula, output_field=FloatField())
    )