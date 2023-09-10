from django.utils import timezone
from django.db import models
from th_auth.models import th_User
class SensorDetails(models.Model):
    date_created = models.DateTimeField(default=timezone.now)
    user_id_owner = models.ForeignKey( th_User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    active = models.BooleanField(default=False)
    access_token = models.CharField(max_length=50, null=True)
    allow_group_admins_to_edit = models.BooleanField(default=False)
    active_alerts = models.BooleanField(default=False)
    favorite = models.BooleanField(default=False)

# temperature and humidity sensor that extends sensor details
class TemperatureHumiditySensorDetails(SensorDetails):
    high_temp_alert = models.FloatField(null=True)
    low_temp_alert = models.FloatField(null=True)
    high_humidity_alert = models.FloatField(null=True)
    low_humidity_alert = models.FloatField(null=True)

class SensorReading(models.Model):
    sensor_id = models.ForeignKey( SensorDetails, on_delete=models.CASCADE)
    temperature = models.FloatField()
    humidity = models.FloatField()
    date_time = models.DateTimeField()
    date_created = models.DateTimeField(default=timezone.now)