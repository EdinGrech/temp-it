from django.db import models

class Sensor(models.Model):
    id = models.AutoField(primary_key=True)
    date_recorded_to_server = models.DateTimeField(auto_now_add=True)
    sensor_id = models.IntegerField()
    date_time = models.DateTimeField()
    temperature = models.FloatField()
    humidity = models.FloatField()

class SensorDetails(models.Model):
    sensor_id = models.AutoField(primary_key=True)
    date_created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    active = models.BooleanField(default=False)
