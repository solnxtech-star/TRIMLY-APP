from django.urls import path
from .views import Salon
urlpatterns = [
    path('', Salon.as_view())
]
