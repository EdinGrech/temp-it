import random
import string
from .models import SensorReading, SensorDetails
from rest_framework import serializers

class SensorReadingsSerializer(serializers.ModelSerializer):
    date_time = serializers.DateTimeField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()

    class Meta:
        model = SensorReading
        fields = ['sensor_id', 'date_time', 'temperature', 'humidity']

        extra_kwargs = {
            'sensor_id': {'required':True, 'help_text':'Sensor ID'},
            'date_time': {'required':True, 'help_text':'Date and time of measurement'},
            'temperature': {'required':True, 'help_text':'Temperature in Celsius'},
            'humidity': {'required':True, 'help_text':'Humidity in %'},
        }

class SensorReadingsSerializerWithoutID(serializers.ModelSerializer):
    date_time = serializers.DateTimeField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()

    class Meta:
        model = SensorReading
        fields = ['date_time', 'temperature', 'humidity']

        extra_kwargs = {
            'date_time': {'required': True, 'help_text': 'Date and time of measurement'},
            'temperature': {'required': True, 'help_text': 'Temperature in Celsius'},
            'humidity': {'required': True, 'help_text': 'Humidity in %'},
        }

class SensorDetailsSerializer(serializers.ModelSerializer):
    date_created = serializers.DateTimeField(read_only=True)
    access_token = serializers.CharField(max_length=50)
    name = serializers.CharField(max_length=50)
    location = serializers.CharField(max_length=50)
    description = serializers.CharField(max_length=200)
    active = serializers.BooleanField(default=False)

    class Meta:
        model = SensorDetails
        fields = ['access_token', 'date_created', 'name', 'location', 'description', 'active']
        extra_kwargs = {
            'name': {'required': True, 'help_text': 'Name of the sensor'},
            'location': {'required': True, 'help_text': 'Location of the sensor'},
            'description': {'required': True, 'help_text': 'Description of the sensor'},
            'active': {'required': True, 'help_text': 'Is the sensor active?'},
        }

    def generate_token(self, instance):
        # Get the user_id and sensor_id
        user_id = str(instance.user_id_owner_id)
        sensor_id = str(instance.id)
        # Calculate the maximum length of the random portion
        max_length = 50 - len(user_id) - len(sensor_id)
        # Generate a random token
        random_token = ''.join(random.choices(string.ascii_letters + string.digits, k=max_length))
        # Concatenate user_id, sensor_id, and random_token
        token = f"{user_id}{random_token}{sensor_id}"
        instance.access_token = token
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.active = validated_data.get('active', instance.active)
        instance.allow_group_admins_to_edit = validated_data.get('allow_group_admins_to_edit', instance.allow_group_admins_to_edit)
        instance.save()
        return instance

