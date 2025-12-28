from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Salons', '0003_remove_salonstaff_image_salonstaff_profile_pic_and_more'),
    ]


    operations = [
        # 1. Manually convert Latitude: Empty string -> NULL -> Numeric
        migrations.RunSQL(
            sql='ALTER TABLE "Vendor_individualvendorprofile" ALTER COLUMN latitude TYPE numeric(22,16) USING NULLIF(latitude, \'\')::numeric(22,16);',
            reverse_sql='ALTER TABLE "Vendor_individualvendorprofile" ALTER COLUMN latitude TYPE varchar(255);'
        ),
        
        # 2. Manually convert Longitude: Empty string -> NULL -> Numeric
        migrations.RunSQL(
            sql='ALTER TABLE "Vendor_individualvendorprofile" ALTER COLUMN longitude TYPE numeric(22,16) USING NULLIF(longitude, \'\')::numeric(22,16);',
            reverse_sql='ALTER TABLE "Vendor_individualvendorprofile" ALTER COLUMN longitude TYPE varchar(255);'
        ),

        # 3. Tell Django the state has changed to DecimalField
        migrations.AlterField(
            model_name='individualvendorprofile',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=16, max_digits=22, null=True),
        ),
        migrations.AlterField(
            model_name='individualvendorprofile',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=16, max_digits=22, null=True),
        ),
    ]