from django.urls import path
from .views import CreateReviewView

urlpatterns = [
    # Endpoint to submit a review
    path('reviews/create/', CreateReviewView.as_view(), name='create-review'),
]