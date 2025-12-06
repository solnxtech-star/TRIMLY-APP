from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site

class Command(BaseCommand):
    help = 'Ensures the Site object with ID 1 is configured with the production domain.'

    def handle(self, *args, **options):
        # 1. Define the production domain details
        LIVE_DOMAIN = 'trimly-app.onrender.com'
        LIVE_SITE_NAME = 'Trimly API'

        # 2. Get or create the Site object with PK=1 (SITE_ID)
        # This handles the case where it might be deleted or not migrated correctly
        site, created = Site.objects.get_or_create(
            pk=1,
            defaults={'domain': LIVE_DOMAIN, 'name': LIVE_SITE_NAME}
        )
        
        # 3. If the site was not created (it already existed), ensure its domain is correct
        if not created and site.domain != LIVE_DOMAIN:
            site.domain = LIVE_DOMAIN
            site.name = LIVE_SITE_NAME
            site.save()
            self.stdout.write(self.style.SUCCESS(f"Updated Site ID 1 domain to: {LIVE_DOMAIN}"))
        elif created:
             self.stdout.write(self.style.SUCCESS(f"Created Site ID 1 with domain: {LIVE_DOMAIN}"))
        else:
            self.stdout.write(self.style.NOTICE(f"Site ID 1 domain is already correct: {LIVE_DOMAIN}"))