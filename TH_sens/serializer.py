import random
import string
from .models import SensorReading, SensorDetails
from rest_framework import serializers
from th_auth.models import th_User

class SensorReadingsSerializer(serializers.ModelSerializer):
    sensor_id = serializers.IntegerField(read_only=True)
    date_time = serializers.DateTimeField(read_only=True)
    temperature = serializers.FloatField(read_only=True)
    humidity = serializers.FloatField(read_only=True)

    class Meta:
        model = SensorReading
        fields = ['sensor_id', 'date_time', 'temperature', 'humidity']

        extra_kwargs = {
            'sensor_id': {'required':True, 'help_text':'Sensor ID'},
            'date_time': {'required':True, 'help_text':'Date and time of measurement'},
            'temperature': {'required':True, 'help_text':'Temperature in Celsius'},
            'humidity': {'required':True, 'help_text':'Humidity in %'},
        }
    
    def create(self, validated_data):
        sensor_id = validated_data.pop('sensor_id')
        try:
            sensor = SensorDetails.objects.get(sensor_id=sensor_id)
        except SensorDetails.DoesNotExist:
            raise serializers.ValidationError(
                {"sensor_id": "Sensor with ID " + sensor_id + " does not exist."}
            )
        validated_data['sensor_id_id'] = sensor.sensor_id
        instance = SensorReading.objects.create(**validated_data)
        instance.save()
        return instance

class SensorDetailsSerializer(serializers.ModelSerializer):
    sensor_id = serializers.IntegerField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    access_token = serializers.CharField(max_length=50)
    user_email_owner = serializers.EmailField()
    name = serializers.CharField(max_length=50)
    location = serializers.CharField(max_length=50)
    description = serializers.CharField(max_length=200)
    active = serializers.BooleanField(default=False)

    class Meta:
        model = SensorDetails
        fields = ['sensor_id', 'access_token', 'user_email_owner', 'date_created', 'name', 'location', 'description', 'active']
        extra_kwargs = {
            'name': {'required': True, 'help_text': 'Name of the sensor'},
            'location': {'required': True, 'help_text': 'Location of the sensor'},
            'user_email_owner': {'required': True, 'help_text': 'Email of the user who owns the sensor'},
            'description': {'required': True, 'help_text': 'Description of the sensor'},
            'active': {'required': True, 'help_text': 'Is the sensor active?'},
        }

    def generate_token(self, instance):
        # Get the user_id and sensor_id
        user_id = instance.user_id_owner_id
        sensor_id = instance.sensor_id
        # Calculate the maximum length of the random portion
        max_length = 50 - len(user_id) - len(sensor_id)
        # Generate a random token
        random_token = ''.join(random.choices(string.ascii_letters + string.digits, k=max_length))
        # Concatenate user_id, sensor_id, and random_token
        token = f"{user_id}{random_token}{sensor_id}"
        instance.access_token = token
        instance.save()
        return instance

    def create(self, validated_data):
        user_email = validated_data.pop('user_email_owner')
        try:
            user = th_User.objects.get(email=user_email)
        except th_User.DoesNotExist:
            raise serializers.ValidationError(
                {"user_email_owner": "User with email " + user_email + " does not exist."}
            )
        validated_data['user_id_owner_id'] = user.id

        instance = SensorDetails.objects.create(**validated_data)
        return instance
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.active = validated_data.get('active', instance.active)
        instance.save()
        return instance

