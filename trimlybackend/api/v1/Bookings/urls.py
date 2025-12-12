from django.urls import path
from .views import (BookingListCreateAPIView, BookingDetailAPIView, UserBookings, UserBookingDetailView, 
SalonBookingsAPIView, SalonBookingDetailAPIView, VendorBookingsAPIView, VendorBookingDetailAPIView)
urlpatterns = [
    path("", BookingListCreateAPIView.as_view(), name="all_bookings"),
    path("<uuid:pk>", BookingDetailAPIView.as_view(), name="bookings_details"),
    path("my-bookings", UserBookings.as_view(), name="my_bookings"),
    path("salon", SalonBookingsAPIView.as_view(), name="salon_bookings"),
    path("salon/<uuid:pk>", SalonBookingDetailAPIView.as_view(), name="salon_booking_detail"),
    path("vendor", VendorBookingsAPIView.as_view(), name="vendor_bookings"),
    path("vendor/<uuid:pk>", VendorBookingDetailAPIView.as_view(), name="vendor_booking_detail")
]