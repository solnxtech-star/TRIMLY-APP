from .models import Conversation, Message
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .serializers import MessageSerializer, ConversationListSerializer
from rest_framework import status, viewsets
from rest_framework.decorators import action

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
    
class MessageAPIView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, conversation_id):
        
        try:
            messages = Message.objects.filter(conversation_id=conversation_id)
            serializer =  MessageSerializer(messages, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"error": e}, status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Q

class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    For chat List
    '''
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        return Conversation.objects.filter(
            Q(customer=self.request.user) | Q(vendor=self.request.user)
        ).prefetch_related('message_set').order_by('-last_message_at')
    
    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_as_read(self, request, pk=None):
        """
        Endpoint: POST /api/v1/conversations/{uuid}/mark-read/
        """
        conversation = self.get_object()
        user = request.user
        
        # Find all unread messages in THIS conversation sent by the OTHER person
        unread_messages = Message.objects.filter(
            conversation=conversation,
            is_read=False
        ).exclude(sender=user)
        
        count = unread_messages.update(is_read=True)
        
        return Response({
            "status": "success",
            "messages_marked_read": count
        })