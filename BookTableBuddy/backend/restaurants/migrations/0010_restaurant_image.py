# Generated by Django 5.2 on 2025-05-06 19:11

import restaurants.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0009_alter_restaurantphoto_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='image',
            field=models.ImageField(blank=True, help_text='Main restaurant image', null=True, upload_to=restaurants.models.restaurant_image_path),
        ),
    ]
