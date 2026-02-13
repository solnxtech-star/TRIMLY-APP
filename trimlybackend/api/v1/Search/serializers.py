from rest_framework import serializers
from api.v1.Search.models import MarketplaceSearch


class MarketplaceSearchSerializer(serializers.ModelSerializer):
    distance = serializers.FloatField(read_only=True)
    type = serializers.CharField(source='provider_type')

    class Meta:
        model = MarketplaceSearch
        fields = ['id', 'display_name', 'type', 'location', 'avg_rating', 'distance']
