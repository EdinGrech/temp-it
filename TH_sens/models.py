from django.db import models
from th_auth.models import User

class SensorDetails(models.Model):
    sensor_id = models.AutoField(primary_key=True)
    date_created = models.DateTimeField(auto_now_add=True)
    user_id_owner = models.ForeignKey( User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    active = models.BooleanField(default=False)

class SensorReading(models.Model):
    id = models.AutoField(primary_key=True)
    access_token = models.CharField(max_length=50)
    date_recorded_to_server = models.DateTimeField(auto_now_add=True)
    sensor_id = models.ForeignKey( SensorDetails, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    temperature = models.FloatField()
    humidity = models.FloatField()