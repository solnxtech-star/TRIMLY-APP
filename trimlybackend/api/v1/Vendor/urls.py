from django.urls import path
from .views import GalleryImageDeleteAPIView, GalleryPostDeleteAPIView, VendorAvailabilitySyncAPIView, VendorServicesListCreateAPIView, VendorViewset, VendorServicesRetrieveUpdateDeleteAPIView,VendorGalleryUploadAPIView, VendorAvailabilityListCreateAPIView, VendorAvailabilityExceptionListCreateAPIView, VendorAvailabilityExceptionRetrieveAPIView, VendorSlotsAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'vendors', VendorViewset, basename='vendors')
urlpatterns = [
    path("vendors/<uuid:id>/services", VendorServicesListCreateAPIView.as_view(), name="vendor_list"),
    path("vendors/<uuid:vendor_id>/services/<uuid:id>/", VendorServicesRetrieveUpdateDeleteAPIView.as_view(), name="vendor_retrieve"),
    path("vendors/<uuid:id>/gallery",VendorGalleryUploadAPIView.as_view(), name="vendor_portfolio" ),
    path(
        "gallery/images/<uuid:id>/", 
        GalleryImageDeleteAPIView.as_view(), 
        name="gallery_image_delete"
    ),
    path('gallery/posts/<uuid:id>/', GalleryPostDeleteAPIView.as_view(), name='delete-gallery-post'),
    path("vendors/<uuid:vendor_id>/availability/", VendorAvailabilityListCreateAPIView.as_view(), name="vendor_availability"),
    path(
        "vendors/<uuid:vendor_id>/availabilities/sync/", 
        VendorAvailabilitySyncAPIView.as_view(), 
        name="vendor_availability_sync"
    ),
    path("vendors/<uuid:vendor_id>/availability-exceptions/",VendorAvailabilityExceptionListCreateAPIView.as_view(), name="vendor_availaibility_exceptions"),
    path("vendors/<uuid:vendor_id>/availability-exceptions/<int:id>/",VendorAvailabilityExceptionRetrieveAPIView.as_view(), name="vendor_availaibility_exceptions_object"),
    path("vendors/<uuid:vendor_id>/available-slots/",VendorSlotsAPIView.as_view(), name="vendor_slots"),
]
urlpatterns += router.urls

