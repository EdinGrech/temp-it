from .models import Sensor
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
        return self.Meta.model(**validated_data) 