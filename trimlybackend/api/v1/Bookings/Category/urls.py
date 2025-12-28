from django.urls import path
from .views import CategoryViewset
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'category', CategoryViewset, basename='category')
urlpatterns = router.urls