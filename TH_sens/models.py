from django.db import models

class Sensor(models.Model):
    sensor_id = models.IntegerField(primary_key=True)
    date_time = models.DateTimeField()
    temperature = models.FloatField()
    humidity = models.FloatField()

class SensorDetails(models.Model):
    sensor_id = models.IntegerField(primary_key=True)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    active = models.BooleanField(default=False)
