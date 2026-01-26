from .models import Conversation, Message
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

class InitiateConversationView(GenericAPIView):
    
    def post(self, request, target_id):
        user = get_user_model()
        target_user = get_object_or_404(user, id=target_id)
        user = request.user
        if user.role == "customer":
            customer = user
            vendor = target_user
        elif user.role in ["salon_owner", "individual_vendor", "admin"]:
            customer = target_user
            vendor = user
        conversation, created = Conversation.objects.get_or_create(
            customer = customer, 
            vendor = vendor
            )

        return Response({"conversation_uuid": conversation.id, "is_new" : created})