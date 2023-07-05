from .models import Sensor, SensorDetails
from rest_framework import serializers

class SensorSerializer(serializers.ModelSerializer):
    sensor_id = serializers.IntegerField()
    date_time = serializers.DateTimeField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()

    class Meta:
        model = Sensor
        fields = ['sensor_id', 'date_time', 'temperature', 'humidity']

        extra_kwargs = {
            'sensor_id': {'required':True, 'help_text':'Sensor ID'},
            'date_time': {'required':True, 'help_text':'Date and time of measurement'},
            'temperature': {'required':True, 'help_text':'Temperature in Celsius'},
            'humidity': {'required':True, 'help_text':'Humidity in %'},
        }
    
    def create(self, validated_data):
        instance = Sensor.objects.create(**validated_data)
        instance.save()
        return instance
    
class SensorDetailsSerializer(serializers.ModelSerializer):
    # have sensor_id and date_created as read-only and not needed for the creation as they are auto generated
    sensor_id = serializers.IntegerField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    name = serializers.CharField(max_length=50)
    location = serializers.CharField(max_length=50)
    description = serializers.CharField(max_length=200)
    active = serializers.BooleanField(default=False)

    class Meta:
        model = SensorDetails
        fields = ['sensor_id', 'date_created', 'name', 'location', 'description', 'active']

        extra_kwargs = {
            'name': {'required':True, 'help_text':'Name of the sensor'},
            'location': {'required':True, 'help_text':'Location of the sensor'},
            'description': {'required':True, 'help_text':'Description of the sensor'},
            'active': {'required':True, 'help_text':'Is the sensor active?'},
        }
    
    def create(self, validated_data):
        instance = SensorDetails.objects.create(**validated_data)
        instance.save()
        return instance