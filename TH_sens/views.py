from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from .models import SensorReading, SensorDetails
from .serializer import SensorReadingsSerializer, SensorDetailsSerializer
from rest_framework.permissions import IsAuthenticated
from th_auth.models import GroupLinkedSensors, GroupMembers, th_User

class SensorReadingView(APIView):
    def post(self, request, **kwargs):
        serializer = SensorReadingsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)
    
class LastDaySensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, **kwargs):
        
        sensor_id = kwargs.get('pk')
        user = request.user
        sensor_owner = SensorDetails.objects.filter(sensor_id=sensor_id, user_id_owner=user.id)
        if not sensor_owner:
            # check if user is a member of the group where the sensor is shared
            sensor_group_ids = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
            for group_id in sensor_group_ids:
                group_members = GroupMembers.objects.filter(group_id=group_id.group_id)
                if user.id in group_members.member_id.all():
                    break  
                else:
                    return Response({'message':'You are not allowed to view this sensor data'}) 
                 
        sensor = SensorReading.objects.filter(sensor_id=sensor_id).order_by('-date_time')[:24]
        serializer = SensorReadingsSerializer(sensor, many=True)
        return Response(serializer.data)

class DateRangeSensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, **kwargs):
        # allow only sensor owner or group members where the sensor is shared to view the data
        user = request.user
        start_date = kwargs.get('start_date')
        end_date = kwargs.get('end_date')
        sensor_id = kwargs.get('pk')
        # check if the user is the owner of the sensor
        sensor_owner = SensorDetails.objects.filter(sensor_id=sensor_id, user_id_owner=user.id)
        if not sensor_owner:
            # check if user is a member of the group where the sensor is shared
            sensor_group_ids = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
            for group_id in sensor_group_ids:
                group_members = GroupMembers.objects.filter(group_id=group_id.group_id)
                if user.id in group_members.member_id.all():
                    break  
                else:
                    return Response({'message':'You are not allowed to view this sensor data'})    
        sensor = SensorReading.objects.filter(sensor_id=sensor_id, date_time__range=[start_date, end_date]).order_by('-date_time')
        serializer = SensorReadingsSerializer(sensor, many=True)
        return Response(serializer.data)
    
class RegisterSensorView(generics.CreateAPIView):
    # register a sensor by getting the data field add_sensor_pin from request and compare it with the user's add_sensor_pin
    # if they match, create a new sensor and return the sensor_id and access_token (the sensor will send the pin to the end point)
    serializer_class = SensorDetailsSerializer
    def post(self, request, **kwargs):
        add_sensor_pin = request.data.get('add_sensor_pin')
        # get user by comparing the add_sensor_pin
        try:
            user:th_User = th_User.objects.get(add_sensor_pin=add_sensor_pin)
            # check if pin expired
            if user.is_pin_expired():
                # clear the pin
                user.set_pin(None)
                return Response({'message':'PIN expired'})
        except th_User.DoesNotExist:
            return Response({'message':'Invalid PIN'})
        sensor = SensorDetails.objects.create(user_id_owner=user.id)
        # generate access token withing the sirealizer
        serializer = SensorDetailsSerializer.generate_token(self, sensor)
        return Response(serializer.data.access_token, status=201)
    
class SensorDetailsView(APIView):
    def get(self, request, **kwargs):
        sensor_id = kwargs.get('pk')
        if sensor_id:
            sensor = SensorDetails.objects.get(sensor_id=sensor_id)
            serializer = SensorDetailsSerializer(sensor)
            return Response(serializer.data)
        return Response({'message':'No sensor ID provided'})

        
        
