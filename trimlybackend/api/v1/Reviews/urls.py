from rest_framework.routers import DefaultRouter
from .views import ReviewViewset

router = DefaultRouter()
router.register("", ReviewViewset, basename="reviews")

urlpatterns = router.urls
