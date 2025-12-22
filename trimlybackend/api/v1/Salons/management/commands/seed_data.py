import random
from datetime import time, date, timedelta
from django.core.management.base import BaseCommand
from django.db import transaction

from api.v1.Users.models import User
from api.v1.Category.models import ServiceCategory, Availability, AvailabilityException
from api.v1.Salons.models import SalonProfile, SalonServices
from api.v1.Vendor.models import IndividualVendorProfile, VendorServices

class Command(BaseCommand):
    help = 'Complete seed: Categories, Customers, Salons + Services, Vendors + Services'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("🚀 Starting Mega Seed..."))
        try:
            with transaction.atomic():
                self.run_seed()
                self.stdout.write(self.style.SUCCESS("🔥 SUCCESS: All roles and services seeded!"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ SEEDING FAILED: {str(e)}"))

    def run_seed(self):
        today = date.today()
        
        # 1. CREATE CATEGORIES
        cat_names = ["Barbing", "Hair Dressing", "Spa & Massage", "Manicure"]
        cats = [ServiceCategory.objects.get_or_create(name=name)[0] for name in cat_names]
        self.stdout.write("✅ Categories created.")

        # 2. CREATE CUSTOMERS (Role: customer)
        for i in range(2):
            User.objects.create_user(
                email=f"customer{i}@example.com",
                username=f"customer_{i}",
                password="password123",
                role="customer",
                first_name=f"Client",
                last_name=str(i)
            )
        self.stdout.write("✅ Customers created.")

        # 3. CREATE SALONS + SERVICES (Role: salon_owner)
        salon_names = ["The Grooming Hub", "Signature Spa"]
        for i, name in enumerate(salon_names):
            owner = User.objects.create_user(
                email=f"owner{i}@salon.com",
                username=f"owner_{i}",
                password="password123",
                role="salon_owner"
            )
            salon = SalonProfile.objects.create(
                owner=owner,
                name=name,
                category=random.choice(cats),
                is_open=True
            )
            
            # Add 3 Services per Salon
            for s in range(3):
                srv = SalonServices.objects.create(
                    salon=salon,
                    name=f"{name} Luxury Service {s}",
                    price=random.randint(5000, 15000),
                    duration_minutes=60
                )
                srv.categories.add(random.choice(cats))

            # Add Availability (0-6)
            for day in range(7):
                Availability.objects.create(salon=salon, day_of_week=day, start_time=time(8,0), end_time=time(20,0))
        self.stdout.write("✅ Salons and Salon Services created.")

        # 4. CREATE INDIVIDUAL VENDORS + SERVICES (Role: individual_vendor)
        vendor_data = [
            {"first": "Tunde", "last": "Barber", "email": "tunde@vendor.com"},
            {"first": "Sarah", "last": "Braids", "email": "sarah@vendor.com"}
        ]
        for v in vendor_data:
            worker = User.objects.create_user(
                email=v["email"],
                username=v["first"].lower(),
                password="password123",
                role="individual_vendor",
                first_name=v["first"],
                last_name=v["last"]
            )
            vendor_profile = IndividualVendorProfile.objects.create(
                worker=worker,
                service_category=random.choice(cats),
                years_of_experience=random.randint(2, 10),
                is_active=True
            )

            # Add 2 Services per Vendor (Linked to 'worker' as per your model requirements)
            for s in range(2):
                VendorServices.objects.create(
                    vendor=vendor_profile, # Use the Profile we just created 2 lines above!
                    name=f"{v['first']}'s {random.choice(cat_names)} Special",
                    price=random.randint(3000, 7000),
                    duration_minutes=45
                )

            # Add Availability (0-6)
            for day in range(7):
                Availability.objects.create(vendor=vendor_profile, day_of_week=day, start_time=time(10,0), end_time=time(18,0))
        self.stdout.write("✅ Vendors and Vendor Services created.")