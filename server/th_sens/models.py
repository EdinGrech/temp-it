from django.db import models
from th_auth.models import th_User
class SensorDetails(models.Model):
    high_temp_alert = models.FloatField()
    low_temp_alert = models.FloatField()
    high_humidity_alert = models.FloatField()
    low_humidity_alert = models.FloatField()
    date_created = models.DateTimeField(auto_now_add=True)
    user_id_owner = models.ForeignKey( th_User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    active = models.BooleanField(default=False)

class SensorReading(models.Model):
    access_token = models.CharField(max_length=50)
    date_recorded_to_server = models.DateTimeField(auto_now_add=True)
    sensor_id = models.ForeignKey( SensorDetails, on_delete=models.CASCADE)
    allow_group_admins_to_edit = models.BooleanField(default=False)
    date_time = models.DateTimeField()
    temperature = models.FloatField()
    humidity = models.FloatField()