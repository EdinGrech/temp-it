# Generated by Django 4.2.3 on 2023-09-07 13:08

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('th_sens', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sensordetails',
            name='high_humidity_alert',
        ),
        migrations.RemoveField(
            model_name='sensordetails',
            name='high_temp_alert',
        ),
        migrations.RemoveField(
            model_name='sensordetails',
            name='low_humidity_alert',
        ),
        migrations.RemoveField(
            model_name='sensordetails',
            name='low_temp_alert',
        ),
        migrations.RemoveField(
            model_name='sensorreading',
            name='access_token',
        ),
        migrations.RemoveField(
            model_name='sensorreading',
            name='allow_group_admins_to_edit',
        ),
        migrations.RemoveField(
            model_name='sensorreading',
            name='date_recorded_to_server',
        ),
        migrations.AddField(
            model_name='sensordetails',
            name='access_token',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sensordetails',
            name='active_alerts',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='sensordetails',
            name='allow_group_admins_to_edit',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='sensorreading',
            name='date_created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='sensordetails',
            name='date_created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.CreateModel(
            name='TemperatureHumiditySensorDetails',
            fields=[
                ('sensordetails_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='th_sens.sensordetails')),
                ('high_temp_alert', models.FloatField(null=True)),
                ('low_temp_alert', models.FloatField(null=True)),
                ('high_humidity_alert', models.FloatField(null=True)),
                ('low_humidity_alert', models.FloatField(null=True)),
            ],
            bases=('th_sens.sensordetails',),
        ),
    ]
