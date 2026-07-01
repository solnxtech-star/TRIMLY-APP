from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


class ConversationListSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    is_last_message_unread = serializers.SerializerMethodField()
    
    # PRODUCTION FIX: Explicitly format to standard ISO-8601 so the frontend sorts perfectly
    last_message_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ", read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'other_user', 'last_message', 'last_message_at', 'is_last_message_unread']

    def get_is_last_message_unread(self, obj):
        request_user = self.context['request'].user
        
        # Because of your Meta ordering, .first() is the absolute latest message
        last_msg = obj.message_set.first()
        
        if not last_msg:
            return False  # No messages, so nothing is 'unread'

        # It's only unread if the OTHER person sent it and is_read is False.
        if last_msg.sender != request_user and not getattr(last_msg, 'is_read', False):
            return True
            
        return False

    def get_other_user(self, obj):
        request_user = self.context['request'].user
        other = obj.vendor if obj.customer == request_user else obj.customer
        
        # Safely get profile picture
        pic_url = None
        # Check both potential profile types safely
        profile = getattr(other, 'customer_profile', None) or getattr(other, 'individual_vendor_profile', None)
        
        if profile and hasattr(profile, 'profile_pic') and profile.profile_pic:
            try:
                pic_url = profile.profile_pic.url
            except ValueError:  # Case where field exists but file is missing
                pic_url = None

        return {
            "id": other.id,
            "full_name": other.get_full_name() if hasattr(other, 'get_full_name') else other.username,
            "profile_pic": pic_url
        }

    def get_last_message(self, obj):
        last_msg = obj.message_set.first()
        if not last_msg:
            return ""
        
        if getattr(last_msg, 'text', None):
            return last_msg.text
            
        # Check for image field safely
        image = getattr(last_msg, 'image', None)
        if image:
            return "Image attached"
            
        return ""