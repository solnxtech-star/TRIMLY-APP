from django.contrib import admin
from django.apps import apps

# Get the configuration for the 'Users' app (replace 'Users' with your app name)
app_config = apps.get_app_config('Payments')

# Loop through all model classes found in the application
for model in app_config.get_models():
    try:
        # Check if the model is already registered (to avoid errors if you register it later manually)
        if not admin.site.is_registered(model):
            # Register the model using the default ModelAdmin configuration
            admin.site.register(model)
            
    except Exception as e:
        # Handle cases where a model might not be registered (rare, but safe)
        print(f"Could not register {model.__name__}: {e}")

# api/v1/Payments/admin.py
from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models import Sum
from .models import Wallet

class PlatformFinanceAdmin(admin.AdminSite):
    pass

def platform_withdrawal_summary(request):
    total_vendor_pending = Wallet.objects.aggregate(
        total=Sum('pending_balance')
    )['total'] or 0

    total_vendor_available = Wallet.objects.aggregate(
        total=Sum('available_balance')
    )['total'] or 0

    context = dict(
        admin.site.each_context(request),
        total_vendor_pending=total_vendor_pending,
        total_vendor_available=total_vendor_available,
        note="Do not withdraw from Flutterwave below (Vendor Pending + Vendor Available) — that money is owed to vendors, not platform revenue.",
    )
    return TemplateResponse(request, "admin/withdrawal_summary.html", context)

# Hook into the default admin site's URLs
original_get_urls = admin.site.get_urls
def get_urls():
    urls = original_get_urls()
    custom = [
        path('withdrawal-summary/', admin.site.admin_view(platform_withdrawal_summary), name='withdrawal-summary'),
    ]
    return custom + urls
admin.site.get_urls = get_urls