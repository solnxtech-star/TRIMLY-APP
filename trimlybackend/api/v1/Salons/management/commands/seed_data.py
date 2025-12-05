from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
# Import your specific models from their respective apps
# For example:
from api.v1.Category.models import ServiceCategory
from api.v1.Salons.models import SalonProfile, SalonServices, SalonPackages
# Replace with your actual model imports:
# class ServiceCategory: # Placeholder class
#     def __init__(self, name):
#         self.name = name
#     def save(self):
#         print(f"  -> Category saved: {self.name}")

# class Salon: # Placeholder class
#     def __init__(self, name, owner):
#         self.name = name
#         self.owner = owner
#     def save(self):
#         print(f"  -> Salon saved: {self.name}")
        
# class Service: # Placeholder class
#     def __init__(self, name, salon, price):
#         self.name = name
#         self.salon = salon
#         self.price = price
#     def save(self):
#         print(f"  -> Service saved: {self.name}")


User = get_user_model() # Assumes you are using a custom User model

class Command(BaseCommand):
    help = 'Populates the database with initial user, salon, and service data.'

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")

        try:
            with transaction.atomic():
                # --- 1. Create Users (Admin, Owner, Customer) ---
                self.stdout.write(self.style.MIGRATE_HEADING("Creating Users..."))

                # Admin User (RLS-bypass user for maintenance)
                admin_user, created = User.objects.get_or_create(
                    email='admin@trimly.com',
                    defaults={
                        'first_name': 'Trimly',
                        'role': 'admin',
                        'is_staff': True,
                        'is_superuser': True
                    }
                )
                if created:
                    admin_user.set_password('adminsecure123') # **CHANGE THIS IMMEDIATELY**
                    admin_user.save()
                    self.stdout.write(self.style.SUCCESS('Admin user created.'))
                
                # Salon Owner User
                owner_user, created = User.objects.get_or_create(
                    email='owner@salonx.com',
                    defaults={
                        'first_name': 'Sarah',
                        'last_name': 'Connor',
                        'role': 'owner',
                    }
                )
                if created:
                    owner_user.set_password('ownerpass123') # **CHANGE THIS**
                    owner_user.save()
                    self.stdout.write(self.style.SUCCESS('Owner user created.'))
                
                # Customer User
                customer_user, created = User.objects.get_or_create(
                    email='customer@example.com',
                    defaults={
                        'first_name': 'John',
                        'last_name': 'Doe',
                        'role': 'customer',
                    }
                )
                if created:
                    customer_user.set_password('customerpass123') # **CHANGE THIS**
                    customer_user.save()
                    self.stdout.write(self.style.SUCCESS('Customer user created.'))


                # --- 2. Create Global Categories (Admin Responsibility) ---
                self.stdout.write(self.style.MIGRATE_HEADING("\nCreating Categories..."))
                
                categories_list = [
                    'Haircut & Styling', 
                    'Manicure & Pedicure', 
                    'Waxing', 
                    'Facials & Skincare',
                    'Massage'
                ]
                
                for name in categories_list:
                    ServiceCategory.objects.get_or_create(name=name)
                haircut_category = ServiceCategory.objects.get(name='Haircut & Styling')    
                self.stdout.write(self.style.SUCCESS(f'{len(categories_list)} categories seeded.'))


                # --- 3. Create Salon ---
                self.stdout.write(self.style.MIGRATE_HEADING("\nCreating Salon Profile..."))
                
                salon_x, created = SalonProfile.objects.get_or_create(
                    owner=owner_user,
                    defaults={
                        'name': 'The Cutting Edge Salon X',
                        'address': '123 Main St, Anytown',
                        'about': 'A premium salon experience.',
                        # ... other required fields ...
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Salon "{salon_x.name}" created for {owner_user.email}'))


                # --- 4. Create Services for the Salon ---
                self.stdout.write(self.style.MIGRATE_HEADING("\nCreating Services..."))
                
                SalonServices.objects.get_or_create(
                    salon=salon_x, 
                    name='Men\'s Standard Cut', 
                    defaults={'price': 25.00, 'category': haircut_category}
                )
                SalonServices.objects.get_or_create(
                    salon=salon_x, 
                    name='Luxury Manicure', 
                    defaults={'price': 45.00, 'category': haircut_category}
                )
                SalonServices.objects.get_or_create(
                    salon=salon_x, 
                    name='Deep Tissue Massage (60 min)', 
                    defaults={'price': 70.00, 'category': haircut_category}
                )
                
                self.stdout.write(self.style.SUCCESS('Services seeded successfully.'))


        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Seeding failed due to an error: {e}"))
            # Note: A transaction.atomic block will automatically rollback on exception

        self.stdout.write(self.style.SUCCESS("\nDatabase seeding completed."))