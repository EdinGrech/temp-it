from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from temp_it.settings import SENSOR_READINGS_PER_HOUR

from th_groups.models import GroupAdmins
from .models import SensorReading, SensorDetails
from .serializer import SensorReadingsSerializer, SensorDetailsSerializer, SensorReadingsSerializerWithoutID
from rest_framework.permissions import IsAuthenticated
from th_auth.models import th_User
from th_groups.serializer import GroupLinkedSensors, GroupMembers

class SensorReadingView(APIView):
    def post(self, request):
        # check if sensor is authorized to post data
        access_token = request.data.get('access_token')
        try:
            sensor = SensorDetails.objects.get(access_token=access_token)
        except SensorDetails.DoesNotExist:
            return Response({'message':'Sensor does not exist or access token is invalid'})
        request.data['sensor_id'] = sensor.id
        request.data.pop('access_token', None)
        serializer = SensorReadingsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'Success':'Data saved'}, status=201)
        return Response(serializer.errors)

class SensorRefreshTokenView(APIView):
    def post(self, request, **kwargs):
        sensor_id = kwargs.get('pk')
        try:
            sensor = SensorDetails.objects.get(id=sensor_id, access_token=request.data.get('access_token'))
        except SensorDetails.DoesNotExist:
            return Response({'message':'Sensor does not exist or access token is invalid'})
        serializer = SensorDetailsSerializer.generate_token(self, sensor)
        return Response({'access_token':f'{serializer.access_token}'}, status=201)

class LastDaySensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, **kwargs):
        sensor_id = kwargs.get('pk')
        user = request.user
        sensor_owner = SensorDetails.objects.filter(id=sensor_id, user_id_owner=user.id)
        if not sensor_owner:
            # check if user is a member of the group where the sensor is shared
            sensor_group_ids = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
            for group_id in sensor_group_ids:
                group_members = GroupMembers.objects.filter(group_id=group_id.group_id)
                if user.id in group_members.member_id.all():
                    sensorReadings = SensorReading.objects.filter(sensor_id=sensor_id).order_by('-date_time')[:24*SENSOR_READINGS_PER_HOUR]
                    serializer = SensorReadingsSerializerWithoutID(sensorReadings, many=True)
                    return Response(serializer.data)  
                else:
                    return Response({'message':'You are not allowed to view this sensor data'})
        elif sensor_owner:
            sensorReadings = SensorReading.objects.filter(sensor_id=sensor_id).order_by('-date_time')[:24*SENSOR_READINGS_PER_HOUR]
            serializer = SensorReadingsSerializer(sensorReadings, many=True)
            return Response(serializer.data)
        else:
            return Response({'message':'Sensor does not exist'})

class DateRangeSensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, **kwargs):
        # allow only sensor owner or group members where the sensor is shared to view the data
        user = request.user
        start_date = kwargs.get('start_date')
        end_date = kwargs.get('end_date')
        sensor_id = kwargs.get('pk')
        # check if the user is the owner of the sensor
        sensor_owner = SensorDetails.objects.filter(id=sensor_id, user_id_owner=user.id)
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
                user.set_pin(None)
                return Response({'message':'PIN expired'})
        except th_User.DoesNotExist:
            return Response({'message':'Invalid PIN'})
        # generate access token withing the sirealizer
        sensor = SensorDetails.objects.create(user_id_owner=user)
        serializer = SensorDetailsSerializer.generate_token(self, sensor)
        serializer.save()
        return Response({
            'sensor_id':f'{serializer.id}',
            'access_token':f'{serializer.access_token}'
            }, status=201)
    
class UpdateSensorDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, **kwargs):
        sensor_id = kwargs.get('pk')
        sensor = SensorDetails.objects.get(id=sensor_id)
        if not sensor:
            return Response({'message':'Sensor does not exist'})
        user = request.user
        sensor_owner = SensorDetails.objects.filter(id=sensor_id, user_id_owner=user.id)
        if not sensor_owner and not sensor.allow_group_admins_to_edit:
            # check if user is a member of the group where the sensor is shared
            sensor_group_ids = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
            for group_id in sensor_group_ids:
                group_admins = GroupAdmins.objects.filter(group_id=group_id.group_id)
                if user.id in group_admins.admins_id.all(): # <-- to check
                    break  
                else:
                    return Response({'message':'You are not allowed to edit this sensor'}) 
        elif sensor_owner:
            serializer = SensorDetailsSerializer(sensor)
            return Response(serializer.data)
        else:
            return Response({'message':'You are not allowed to edit this sensor'})
    
class SensorDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        sensor_id = kwargs.get('pk')
        user = request.user
        sensor = SensorDetails.objects.filter(id=sensor_id, user_id_owner=user.id).first()
        if not sensor:
            sensor_group_ids = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
            for group_id in sensor_group_ids:
                group_members = GroupMembers.objects.filter(group_id=group_id.group_id)
                if user.id in group_members.member_id.all():
                    if sensor:
                        serializer = SensorDetailsSerializer(sensor)
                        return Response(serializer.data)
            return Response({'message': 'You are not allowed to view this sensor data'})

        if sensor:
            serializer = SensorDetailsSerializer(sensor)
            return Response(serializer.data)
        else:
            return Response({'message': 'Sensor does not exist'})

        
class EditSensorDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, **kwargs):
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
        elif sensor_owner:
            sensor = SensorDetails.objects.get(sensor_id=sensor_id)
            serializer = SensorDetailsSerializer(sensor)
            return Response(serializer.data)
        else:
            return Response({'message':'Sensor does not exist'})
