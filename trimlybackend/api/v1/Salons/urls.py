from django.urls import path
from .views import SalonViewset, SalonServicesListCreateAPIView, SalonServicesRetrieveUpdateDeleteAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'salons', SalonViewset, basename='salons')
urlpatterns = [
    path("salons/<int:id>/services", SalonServicesListCreateAPIView.as_view(), name="salon_list"),
    path("services/salon/<int:id>/", SalonServicesRetrieveUpdateDeleteAPIView.as_view(), name="salon_list")
]

urlpatterns += router.urls