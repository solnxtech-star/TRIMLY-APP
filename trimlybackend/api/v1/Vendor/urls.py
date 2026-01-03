from django.urls import path
from .views import VendorServicesListCreateAPIView, VendorViewset, VendorServicesRetrieveUpdateDeleteAPIView,VendorGalleryUploadAPIView, VendorAvailabilityListCreateAPIView, VendorAvailabilityRetrieveUpdateDeleteAPIView, VendorAvailabilityExceptionListCreateAPIView, VendorAvailabilityExceptionRetrieveAPIView, VendorSlotsAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'vendors', VendorViewset, basename='vendors')
urlpatterns = [
    path("vendors/<uuid:id>/services", VendorServicesListCreateAPIView.as_view(), name="vendor_list"),
    path("vendors/<uuid:vendor_id>/services/<int:id>/", VendorServicesRetrieveUpdateDeleteAPIView.as_view(), name="vendor_retrieve"),
    path("vendors/<uuid:id>/gallery",VendorGalleryUploadAPIView.as_view(), name="vendor_portfolio" ),
    path("vendors/<uuid:vendor_id>/availability/", VendorAvailabilityListCreateAPIView.as_view(), name="vendor_availability"),
    path("vendors/<uuid:vendor_id>/availability/<int:id>/", VendorAvailabilityRetrieveUpdateDeleteAPIView.as_view(), name="vendor_retrieve_availability"),
    path("vendors/<uuid:vendor_id>/availability-exceptions/",VendorAvailabilityExceptionListCreateAPIView.as_view(), name="vendor_availaibility_exceptions"),
    path("vendors/<uuid:vendor_id>/availability-exceptions/<int:id>/",VendorAvailabilityExceptionRetrieveAPIView.as_view(), name="vendor_availaibility_exceptions_object"),
    path("vendors/<uuid:vendor_id>/available-slots/",VendorSlotsAPIView.as_view(), name="vendor_slots"),
]
urlpatterns += router.urls

