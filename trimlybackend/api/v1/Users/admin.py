from django.contrib import admin
from django.apps import apps

# Get the configuration for the 'Users' app (replace 'Users' with your app name)
app_config = apps.get_app_config('Users')

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