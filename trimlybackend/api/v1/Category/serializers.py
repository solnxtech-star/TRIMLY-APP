from rest_framework import serializers
from.models import ServiceCategory
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = "__all__"
        read_only_fields = ["id"]