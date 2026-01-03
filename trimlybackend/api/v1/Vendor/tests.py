from rest_framework.test import APITestCase
from .models import IndividualVendorProfile
from django.urls import reverse
from rest_framework import status

class UserTests(APITestCase):
    def check_unauthorised_Vendor_post_request(self):
        endpoint = reverse("vendor_availability")
        data = {"test", "play"}
        response = self.client.post(endpoint, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
