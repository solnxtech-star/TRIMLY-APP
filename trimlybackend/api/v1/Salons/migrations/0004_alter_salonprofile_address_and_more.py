from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('Salons', '0003_remove_salonstaff_image_salonstaff_profile_pic_and_more'),
    ]

    operations = [
        # 1. CLEAN THE DATA FIRST
        # This SQL tells the database: "If the value is an empty string, make it NULL"
        migrations.RunSQL(
            sql='UPDATE "Salons_salonprofile" SET latitude = NULL WHERE latitude = \'\';',
            reverse_sql=""
        ),
        migrations.RunSQL(
            sql='UPDATE "Salons_salonprofile" SET longitude = NULL WHERE longitude = \'\';',
            reverse_sql=""
        ),

        # 2. NOW APPLY THE FIELD CHANGES
        migrations.AlterField(
            model_name='salonprofile',
            name='address',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='salonprofile',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=16, max_digits=22, null=True),
        ),
        migrations.AlterField(
            model_name='salonprofile',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=16, max_digits=22, null=True),
        ),
    ]