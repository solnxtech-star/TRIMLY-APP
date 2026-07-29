# api/v1/Users/apps.py  (or wherever makes sense in your project)
from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.v1.Users'

    def ready(self):
        from django.contrib import admin
        admin.site.site_header = "Trimly Admin"
        admin.site.site_title = "Trimly Admin Portal"
        admin.site.index_title = "Welcome to Trimly Backend Management"
        