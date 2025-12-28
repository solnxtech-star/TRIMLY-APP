from rest_framework import generics, permissions

from api.v1.Reviews.models import Review
from api.v1.Reviews.serializers import ReviewSerializer

class CreateReviewView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the customer to the logged-in user
        serializer.save(customer=self.request.user)