from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can ONLY see notifications where they are the recipient
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_as_read(self, request):
        """
        Endpoint: POST /api/v1/notifications/mark-all-read/
        Flipping all unread notifications to True in one SQL hit.
        """
        unread = self.get_queryset().filter(is_read=False)
        count = unread.update(is_read=True)
        
        return Response({
            "status": "success",
            "message": f"Marked {count} notifications as read."
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_single_as_read(self, request, pk=None):
        """
        Endpoint: POST /api/v1/notifications/{id}/mark-read/
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "success"}, status=status.HTTP_200_OK)