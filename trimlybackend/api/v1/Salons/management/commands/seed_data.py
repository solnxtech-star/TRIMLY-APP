import random
from datetime import time, date, timedelta
from django.core.management.base import BaseCommand
from django.db import transaction

# Import your models based on your architecture
from api.v1.Users.models import User
from api.v1.Category.models import ServiceCategory, Availability, AvailabilityException
from api.v1.Salons.models import SalonProfile, SalonServices
from api.v1.Vendor.models import IndividualVendorProfile, VendorServices

class Command(BaseCommand):
    help = 'Seeds the database with 2 customers, 3 salons, and 3 vendors with services and exceptions'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("🚀 Starting Atomic Mega Seed..."))

        try:
            with transaction.atomic():
                self.run_seed()
                self.stdout.write(self.style.SUCCESS("\n" + "="*40))
                self.stdout.write(self.style.SUCCESS("🔥 SUCCESS: Database seeded successfully!"))
                self.stdout.write(self.style.SUCCESS("="*40))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ ERROR DURING SEEDING: {str(e)}"))

    def run_seed(self):
        # --- 1. CREATE CATEGORIES ---
        cat_names = ["Hair Styling", "Nail Art", "Massage Therapy", "Skin Care"]
        cats = [ServiceCategory.objects.get_or_create(name=name)[0] for name in cat_names]
        self.stdout.write(f"✅ Created {len(cats)} Categories.")

        # --- 2. CREATE CUSTOMERS (2 Users) ---
        for i in range(1, 3):
            email = f"customer{i}@trimly.com"
            u, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': f"customer_{i}", 
                    'role': 'customer', 
                    'phone_number': f"+234800000000{i}",
                    'first_name': f"Customer",
                    'last_name': str(i)
                }
            )
            if created:
                u.set_password("password123")
                u.save()
        self.stdout.write("✅ Created 2 Customer Accounts.")

        today = date.today()

        # --- 3. CREATE 3 SALONS (Profile has 'name' field) ---
        salon_data = [
            {"name": "The Golden Shears", "email": "owner0@salon.com"},
            {"name": "Luxe Glow Salon", "email": "owner1@salon.com"},
            {"name": "Ivory Wellness", "email": "owner2@salon.com"}
        ]
        
        for i, s_info in enumerate(salon_data):
            owner = User.objects.create_user(
                email=s_info["email"], 
                username=f"salon_owner_{i}", 
                password="password123", 
                role="salon_owner",
                first_name="Owner",
                last_name=str(i)
            )
            
            salon = SalonProfile.objects.create(
                owner=owner,
                name=s_info["name"],
                category=random.choice(cats),
                address=f"{i+100} Victoria Island, Lagos",
                latitude="6.4281",
                longitude="3.4398",
                is_open=True
            )
            
            # 3 Services per Salon
            for j in range(1, 4):
                service = SalonServices.objects.create(
                    salon=salon,
                    name=f"{s_info['name']} Srv {j}",
                    price=random.randint(8000, 25000),
                    duration_minutes=random.choice([30, 60, 90])
                )
                service.categories.add(random.choice(cats))
            
            # 7 Days Availability
            for d in range(7):
                Availability.objects.create(
                    salon=salon,
                    date=today + timedelta(days=d),
                    start_time=time(9, 0),
                    end_time=time(18, 0)
                )

            # Holiday Exception (Closed in 3 days)
            AvailabilityException.objects.create(
                salon=salon,
                date=today + timedelta(days=3),
                is_available=False
            )
            self.stdout.write(f"🏠 Created Salon: {s_info['name']}")

        # --- 4. CREATE 3 INDIVIDUAL VENDORS (Profile uses 'worker' User for name) ---
        vendor_data = [
            {"first": "Bode", "last": "The Barber", "email": "vendor0@trimly.com"},
            {"first": "Amaka", "last": "Braids", "email": "vendor1@trimly.com"},
            {"first": "Tunde", "last": "Massage", "email": "vendor2@trimly.com"}
        ]

        for i, v_info in enumerate(vendor_data):
            worker = User.objects.create_user(
                email=v_info["email"], 
                username=f"vendor_user_{i}", 
                password="password123", 
                role="individual_vendor",
                first_name=v_info["first"],
                last_name=v_info["last"]
            )
            
            vendor = IndividualVendorProfile.objects.create(
                worker=worker,
                service_category=random.choice(cats),
                years_of_experience=random.randint(3, 15),
               
            )
            
            # 3 Services per Vendor
            full_name = f"{v_info['first']} {v_info['last']}"
            for j in range(1, 4):
                VendorServices.objects.create(
                    vendor=vendor,
                    name=f"{full_name} Custom Srv {j}",
                    price=random.randint(3000, 12000),
                    duration_minutes=random.choice([30, 45, 60])
                )
            
            # 7 Days Availability
            for d in range(7):
                Availability.objects.create(
                    vendor=vendor,
                    date=today + timedelta(days=d),
                    start_time=time(10, 0),
                    end_time=time(19, 0)
                )

            # Partial Day Exception (Tomorrow)
            AvailabilityException.objects.create(
                vendor=vendor,
                date=today + timedelta(days=1),
                is_available=True,
                start_time=time(12, 0),
                end_time=time(15, 0)
            )
            self.stdout.write(f"✂️ Created Vendor: {full_name}")