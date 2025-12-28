from .serializers import CategorySerializer
from rest_framework import viewsets, permissions
from .models import ServiceCategory
class CategoryViewset(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = CategorySerializer

#could write custom peermision for isadmin or readonly
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    