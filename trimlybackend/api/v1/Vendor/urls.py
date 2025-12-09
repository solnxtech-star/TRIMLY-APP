from django.urls import path
from .views import VendorServicesListCreateAPIView, VendorViewset, VendorServicesRetrieveUpdateDeleteAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'vendors', VendorViewset, basename='vendors')
urlpatterns = [
    path("vendors/<int:id>/services", VendorServicesListCreateAPIView.as_view(), name="vendor_list"),
    path("services/vendor/<int:id>/", VendorServicesRetrieveUpdateDeleteAPIView.as_view(), name="vendor_retrieve")
]

urlpatterns += router.urls