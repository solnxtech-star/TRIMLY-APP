from django.urls import path
from .views import BookingListCreateAPIView, BookingDetailAPIView, UserBookings, UserBookingDetailView
urlpatterns = [
    path("", BookingListCreateAPIView.as_view(), name="all_bookings"),
    path("<uuid:pk>", BookingDetailAPIView.as_view(), name="bookings_details"),
    path("my-bookings", UserBookings.as_view(), name="my_bookings"),
    path("my-bookings/<uuid:pk>", UserBookingDetailView.as_view(), name="my_booking_detail")
]