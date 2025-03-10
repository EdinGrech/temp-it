import random
import string
from .models import SensorReading, TemperatureHumiditySensorDetails
from rest_framework import serializers

class SensorReadingsSerializer(serializers.ModelSerializer):
    date_time = serializers.DateTimeField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()

    class Meta:
        model = SensorReading
        fields = ['sensor_id', 'date_time', 'temperature', 'humidity']

        extra_kwargs = {
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
    favorite = serializers.BooleanField(default=False)

    class Meta:
        model = TemperatureHumiditySensorDetails
        fields = ['access_token', 'date_created', 'name', 'location', 'description', 'active', 'favorite']
        extra_kwargs = {
            'name': {'required': True, 'help_text': 'Name of the sensor'},
            'location': {'required': True, 'help_text': 'Location of the sensor'},
            'description': {'required': False, 'help_text': 'Description of the sensor'},
            'active': {'required': True, 'help_text': 'Is the sensor active?'},
            'favorite': {'required': False, 'help_text': 'Is the sensor a favorite?'},
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

class UserInteractionTemperatureHumiditySensorDetails(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    name = serializers.CharField(max_length=50)
    location = serializers.CharField(max_length=50)
    description = serializers.CharField(max_length=200)
    active = serializers.BooleanField(default=False)
    high_temp_alert = serializers.FloatField()
    low_temp_alert = serializers.FloatField()
    high_humidity_alert = serializers.FloatField()
    low_humidity_alert = serializers.FloatField()
    allow_group_admins_to_edit = serializers.BooleanField(default=False)
    active_alerts = serializers.BooleanField()
    favorite = serializers.BooleanField(default=False)

    class Meta:
        model = TemperatureHumiditySensorDetails
        fields = ['id', 'date_created', 'name', 'location', 'description', 'active', 'allow_group_admins_to_edit', 'active_alerts', 'high_temp_alert', 'low_temp_alert', 'high_humidity_alert', 'low_humidity_alert', 'favorite']
        extra_kwargs = {
            'name': {'required': True, 'help_text': 'Name of the sensor'},
            'location': {'required': True, 'help_text': 'Location of the sensor'},
            'description': {'required': True, 'help_text': 'Description of the sensor'},
            'active': {'required': True, 'help_text': 'Is the sensor active?'},
            'allow_group_admins_to_edit': {'required': True, 'help_text': 'Allow group admins to edit?'},
            'active_alerts': {'required': True, 'help_text': 'Active alerts?'},
            'high_temp_alert': {'required': True, 'help_text': 'High temperature alert'},
            'low_temp_alert': {'required': True, 'help_text': 'Low temperature alert'},
            'high_humidity_alert': {'required': True, 'help_text': 'High humidity alert'},
            'low_humidity_alert': {'required': True, 'help_text': 'Low humidity alert'},
            'favorite': {'required': False, 'help_text': 'Is the sensor a favorite?'},
        }
    
    def update(self, instance: TemperatureHumiditySensorDetails, validated_data: dict) -> TemperatureHumiditySensorDetails:
        print(instance)
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.active = validated_data.get('active', instance.active)
        instance.allow_group_admins_to_edit = validated_data.get('allow_group_admins_to_edit', instance.allow_group_admins_to_edit)
        instance.active_alerts = validated_data.get('active_alerts', instance.active_alerts)
        instance.high_temp_alert = validated_data.get('high_temp_alert', instance.high_temp_alert)
        instance.low_temp_alert = validated_data.get('low_temp_alert', instance.low_temp_alert)
        instance.high_humidity_alert = validated_data.get('high_humidity_alert', instance.high_humidity_alert)
        instance.low_humidity_alert = validated_data.get('low_humidity_alert', instance.low_humidity_alert)
        instance.save()
        return instance