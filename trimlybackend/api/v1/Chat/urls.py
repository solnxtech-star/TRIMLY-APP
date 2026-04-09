from django.urls import path
from .views import InitiateConversationView, MessageAPIView

urlpatterns = [
    path('conversations/initiate/<uuid:target_id>/',InitiateConversationView.as_view(), name="initiate_conversation"),
    path('conversations/messages/<uuid:conversation_id>/',MessageAPIView.as_view(), name="message" )
]