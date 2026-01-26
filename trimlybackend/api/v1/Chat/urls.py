from django.urls import path
from .views import InitiateConversationView

urlpatterns = [
    path('conversations/initiate/<uuid:target_id>/',InitiateConversationView.as_view(), name="initiate_conversation" )
]