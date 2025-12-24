from django.urls import path
from .views import SalonViewset, SalonServicesListCreateAPIView, SalonServicesRetrieveUpdateDeleteAPIView, SalonAvailabilityListCreateAPIView, SalonAvailabilityRetrieveUpdateDeleteAPIView, SalonAvailabilityExceptionListCreateAPIView, SalonAvailabilityExceptionRetrieveAPIView, SalonSlotsAPIView, SalonGalleryUploadAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'salons', SalonViewset, basename='salons')

urlpatterns = [
    path("salons/<uuid:id>/services", SalonServicesListCreateAPIView.as_view(), name="salon_list"),
    path("salons/<uuid:salon_id>/services/<int:pk>/", SalonServicesRetrieveUpdateDeleteAPIView.as_view(), name="salon_list"),
    path("salons/<uuid:id>/availability/", SalonAvailabilityListCreateAPIView.as_view(), name="salon_availability"),
    # path("salons/<int:salon_id>/availability/<int:pk>/", SalonAvailabilityRetrieveUpdateDeleteAPIView.as_view(), name="salon_availability_object"),
    path("salons/<uuid:salon_id>/availability-exceptions/", SalonAvailabilityExceptionListCreateAPIView.as_view(), name="salon_availability_exception"),
    # path("salons/<int:salon_id>/availability-exceptions/<int:id>", SalonAvailabilityExceptionRetrieveAPIView.as_view(), name="salon_availability_exception_object"),
    path("salons/<uuid:salon_id>/slots/", SalonSlotsAPIView.as_view(), name="salon_slot"),
    path("salons/<uuid:salon_id>/gallery/", SalonGalleryUploadAPIView.as_view(), name="salon_gallery"),
]

urlpatterns += router.urls
