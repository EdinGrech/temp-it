# Generated by Django 4.2.3 on 2023-07-28 16:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SensorDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('high_temp_alert', models.FloatField(null=True)),
                ('low_temp_alert', models.FloatField(null=True)),
                ('high_humidity_alert', models.FloatField(null=True)),
                ('low_humidity_alert', models.FloatField(null=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=50)),
                ('location', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=200)),
                ('active', models.BooleanField(default=False)),
                ('user_id_owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SensorReading',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('access_token', models.CharField(max_length=50)),
                ('date_recorded_to_server', models.DateTimeField(auto_now_add=True)),
                ('allow_group_admins_to_edit', models.BooleanField(default=False)),
                ('date_time', models.DateTimeField()),
                ('temperature', models.FloatField()),
                ('humidity', models.FloatField()),
                ('sensor_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='th_sens.sensordetails')),
            ],
        ),
    ]
