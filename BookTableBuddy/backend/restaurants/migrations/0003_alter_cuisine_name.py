# Generated by Django 5.2 on 2025-05-06 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cuisine',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
