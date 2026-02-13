from django.contrib.gis.db import models
from rest_framework import serializers

class MarketplaceSearch(models.Model):
    display_name = models.CharField(max_length=255)
    location = models.PointField(srid=4326)
    category_id = models.IntegerField()
    provider_type = models.CharField(max_length=10) # 'salon' or 'vendor'
    search_text = models.TextField()
    avg_rating = models.FloatField()

    class Meta:
        managed = False  # Django will not attempt to create a table
        db_table = 'marketplace_view'

