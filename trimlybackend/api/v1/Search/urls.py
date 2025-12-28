from django.urls import path
from .views import GlobalMarketplaceSearchAPIView

urlpatterns = [
    path('', GlobalMarketplaceSearchAPIView.as_view(), name = "global_search")
]