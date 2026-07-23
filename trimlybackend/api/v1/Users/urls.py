from django.urls import path
from .views import UserProfileListView, DeleteUserView
urlpatterns = [
    path("", UserProfileListView.as_view(), name="view_user" ),
    path('delete-account/', DeleteUserView.as_view(), name='delete-account')

]