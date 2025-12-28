from rest_framework import serializers

class UnifiedSearchSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    display_name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    service_name = serializers.CharField(source='service_category.name', read_only=True)
    avg_rating = serializers.FloatField()
    distance = serializers.FloatField(required=False) # Only if GPS is sent
    profile_pic = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        # Logic to pick the right name field based on the model
        return getattr(obj, 'name', 'Unknown')

    def get_type(self, obj):
        return "salon" if hasattr(obj, 'is_open') else "individual"

    def get_profile_pic(self, obj):
        return obj.profile_pic.url if obj.profile_pic else None
        
   

    def get_avg_rating(self, obj):
        # If avg_rating from annotation is None, return 0.0
        return getattr(obj, 'avg_rating', 0) or 0.0