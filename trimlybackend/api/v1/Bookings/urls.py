from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, VerifyNINView
from django.urls import path

router = DefaultRouter()
router.register("bookings", BookingViewSet, basename="booking")

urlpatterns = router.urls
urlpatterns = router.urls + [
    path("verify-nin/", VerifyNINView.as_view(), name="verify_nin"),
]