from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import InitiateConversationView, MessageAPIView, ConversationViewSet


router = DefaultRouter()
router.register("conversations", ConversationViewSet, basename="conversation")
urlpatterns = router.urls + [
    path('conversations/initiate/<uuid:target_id>/',InitiateConversationView.as_view(), name="initiate_conversation"),
    path('conversations/messages/<uuid:conversation_id>/',MessageAPIView.as_view(), name="message" )
]

