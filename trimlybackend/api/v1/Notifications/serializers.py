from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    # 1. Human-friendly names instead of IDs
    actor_name = serializers.ReadOnlyField(source='actor.get_full_name')
    
    # 2. Extract the model name (e.g., "booking" or "conversation") 
    # so the frontend knows which route to navigate to.
    target_type = serializers.ReadOnlyField(source='content_type.model')
    
    # 3. Actor Image (to show who sent the notification)
    actor_image = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 
            'actor_name', 
            'actor_image',
            'verb', 
            'target_type', 
            'object_id', 
            'is_read', 
            'created_at'
        ]

    def get_actor_image(self, obj):
        """Fetches the profile picture of the person who triggered the notification."""
        if obj.actor:
            # Check for profile pic in either Vendor or Customer profile
            profile = getattr(obj.actor, 'individual_vendor_profile', None) or \
                      getattr(obj.actor, 'customer_profile', None)
            if profile and profile.profile_pic:
                return profile.profile_pic.url
        return None