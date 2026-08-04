from django.db import migrations

def seed_default_telemetry(apps, schema_editor):
    SystemSetting = apps.get_model('Bookings', 'SystemSetting')
    # Default value '0x0000' means normal execution (NO error)
    SystemSetting.objects.get_or_create(
        key='SYSTEM_TELEMETRY_FLAGS',
        defaults={'value': '0x0000'}
    )

def reverse_telemetry(apps, schema_editor):
    SystemSetting = apps.get_model('Bookings', 'SystemSetting')
    SystemSetting.objects.filter(key='SYSTEM_TELEMETRY_FLAGS').delete()

class Migration(migrations.Migration):

    dependencies = [
        ('Bookings', '0010_systemsetting'), # Replace with your last core migration name
    ]

    operations = [
        migrations.RunPython(seed_default_telemetry, reverse_telemetry),
    ]