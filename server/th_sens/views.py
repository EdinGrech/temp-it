from datetime import datetime, timedelta
from typing import Any
from requests import Request
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from temp_it.settings.prod import SENSOR_READINGS_PER_HOUR

from th_groups.models import GroupAdmins
from .models import SensorReading, TemperatureHumiditySensorDetails
from .serializer import (
    SensorReadingsSerializer, 
    SensorDetailsSerializer, 
    SensorReadingsSerializerWithoutID, 
    UserInteractionTemperatureHumiditySensorDetails
)
from rest_framework.permissions import IsAuthenticated
from th_auth.models import th_User
from th_groups.serializer import GroupLinkedSensors, GroupMembers

from django.db.models import QuerySet
from rest_framework import status

class SensorReadingView(APIView):
    def post(self, request: Request, **kwargs: Any) -> Response:
        # Check if sensor is authorized to post data
        access_token = request.data.get('access_token')
        sensor = TemperatureHumiditySensorDetails.objects.get(access_token=access_token)
        if not sensor:
            return Response({'message': 'Sensor does not exist or access token is invalid'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure date_time is in the past and not later than 2 days
        date_time_str = request.data.get('date_time')
        if date_time_str:
            date_time = datetime.strptime(date_time_str, '%Y-%m-%dT%H:%M')
            now = datetime.now()
            print(date_time, now)
            print((now - timedelta(days=2)) <= date_time <= now)
            if (not(now - timedelta(days=2)) <= date_time <= now):
                return Response({'message': 'Invalid date_time format'}, status=status.HTTP_400_BAD_REQUEST)
                
        
        # Ensure temperature is between -15 and 50
        temperature = request.data.get('temperature')
        # convert temperature integer
        if temperature is not None and not (-15 <= float(temperature) <= 50):
            return Response({'message': 'Temperature should be between -15 and 50'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure humidity is between 0 and 100
        humidity = request.data.get('humidity')
        if humidity is not None and not (0 <= float(humidity) <= 100):
            return Response({'message': 'Humidity should be between 0 and 100'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.data['sensor_id'] = sensor.id
        request.data.pop('access_token', None)
        
        serializer = SensorReadingsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'Success': 'Data saved'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SensorRefreshTokenView(APIView):
    def post(self, request: Request, **kwargs: Any) -> Response:
        sensor_id: int = kwargs.get('pk')
        try:
            sensor: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.get(id=sensor_id, access_token=request.data.get('access_token'))
        except TemperatureHumiditySensorDetails.DoesNotExist:
            return Response({'message': 'Sensor does not exist'}, status=444)
        serializer: SensorDetailsSerializer = SensorDetailsSerializer.generate_token(self, sensor)
        return Response({'access_token': f'{serializer.access_token}'}, status=201)

class LastDaySensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request, **kwargs: Any) -> Response:
        sensor_id: int = kwargs.get('pk')
        user: th_User = request.user
        if(TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).exists()):
            sensorReadings: QuerySet[SensorReading] = SensorReading.objects.filter(sensor_id=sensor_id).order_by('-date_created')[:24 * SENSOR_READINGS_PER_HOUR]
            serializer: SensorReadingsSerializer = SensorReadingsSerializer(sensorReadings, many=True)
            return Response(serializer.data)
        else:
            if(GroupLinkedSensors.objects.filter(sensor_id=sensor_id).exists()):
                sensor_group_ids: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
                for group_id in sensor_group_ids:
                    group_members: QuerySet[GroupMembers] = GroupMembers.objects.filter(group_id=group_id.group_id)
                    if user.id in group_members.member_id.all():
                        sensorReadings: QuerySet[SensorReading] = SensorReading.objects.filter(sensor_id=sensor_id).order_by('-date_created')[:24 * SENSOR_READINGS_PER_HOUR]
                        serializer: SensorReadingsSerializerWithoutID = SensorReadingsSerializerWithoutID(sensorReadings, many=True)
                        return Response(serializer.data)  
                    else:
                        return Response({'message': 'You are not allowed to view this sensor data'}, status=403)
            else:
                return Response({'message': 'Sensor does not exist'}, status=444)

class LastSensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request, **kwargs: Any) -> Response:
        sensor_id: int = kwargs.get('pk')
        user: th_User = request.user
        if(TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).exists()):
            sensor_reading = SensorReading.objects.filter(sensor_id=sensor_id).latest('id')
            serializer = SensorReadingsSerializer(sensor_reading)
            return Response(serializer.data)
        else:
            if(GroupLinkedSensors.objects.filter(sensor_id=sensor_id).exists()):
                sensor_group_ids: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
                for group_id in sensor_group_ids:
                    group_members: QuerySet[GroupMembers] = GroupMembers.objects.filter(group_id=group_id.group_id)
                    if user.id in group_members.member_id.all():
                        sensor_reading = SensorReading.objects.filter(sensor_id=sensor_id).latest('id')
                        serializer = SensorReadingsSerializer(sensor_reading)
                        return Response(serializer.data)
                    else:
                        return Response({'message': 'You are not allowed to view this sensor data'}, status=403)
            else:
                return Response({'message': 'Sensor does not exist'}, status=444)            

class depDateRangeSensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request, **kwargs: Any) -> Response:
        # allow only sensor owner or group members where the sensor is shared to view the data
        user: th_User = request.user
        start_date: str = kwargs.get('start_date')
        end_date: str = kwargs.get('end_date')
        sensor_id: int = kwargs.get('pk')
        # check if the user is the owner of the sensor
        if(TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).exists()):
            sensor: QuerySet[SensorReading] = SensorReading.objects.filter(sensor_id=sensor_id, date_time__range=[start_date, end_date]).order_by('-date_time')
            serializer: SensorReadingsSerializer = SensorReadingsSerializer(sensor, many=True)
            return Response(serializer.data)
        else:
            if(GroupLinkedSensors.objects.filter(sensor_id=sensor_id).exists()):
                sensor_group_ids: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
                for group_id in sensor_group_ids:
                    group_members: QuerySet[GroupMembers] = GroupMembers.objects.filter(group_id=group_id.group_id)
                    if user.id in group_members.member_id.all():
                        sensor: QuerySet[SensorReading] = SensorReading.objects.filter(sensor_id=sensor_id, date_time__range=[start_date, end_date]).order_by('-date_time')
                        serializer: SensorReadingsSerializer = SensorReadingsSerializer(sensor, many=True)
                        return Response(serializer.data)  
                    else:
                        return Response({'message': 'You are not allowed to view this sensor data'}, status=403)
            else:
                return Response({'message': 'Sensor does not exist'}, status=444)
            
class DateRangeSensorReadingView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request: Request, **kwargs: Any) -> Response:
        # allow only sensor owner or group members where the sensor is shared to view the data
        user: th_User = request.user
        start_date: str = request.data.get('startDate')
        end_date: str = request.data.get('endDate')
        sensor_id: int = kwargs.get('pk')
        # check if the user is the owner of the sensor
        if(TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).exists()):
            sensor: QuerySet[SensorReading] = SensorReading.objects.filter(sensor_id=sensor_id, date_time__range=[start_date, end_date]).order_by('-date_time')
            serializer: SensorReadingsSerializer = SensorReadingsSerializer(sensor, many=True)
            return Response(serializer.data)
        else:
            if(GroupLinkedSensors.objects.filter(sensor_id=sensor_id).exists()):
                sensor_group_ids: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
                for group_id in sensor_group_ids:
                    group_members: QuerySet[GroupMembers] = GroupMembers.objects.filter(group_id=group_id.group_id)
                    if user.id in group_members.member_id.all():
                        sensor: QuerySet[SensorReading] = SensorReading.objects.filter(sensor_id=sensor_id, date_time__range=[start_date, end_date]).order_by('-date_time')
                        serializer: SensorReadingsSerializer = SensorReadingsSerializer(sensor, many=True)
                        return Response(serializer.data)  
                    else:
                        return Response({'message': 'You are not allowed to view this sensor data'}, status=403)
            else:
                return Response({'message': 'Sensor does not exist'}, status=444)
            
class DeleteSensorView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request: Request, **kwargs: Any) -> Response:
        # allow only sensor owner or group members where the sensor is shared to view the data
        user: th_User = request.user
        sensor_id: int = kwargs.get('pk')
        # check if the user is the owner of the sensor
        if(TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).exists()):
            sensor: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.get(id=sensor_id)
            sensor.delete()
            return Response({'message': 'Sensor deleted'}, status=201)
        elif(TemperatureHumiditySensorDetails.objects.filter(sensor_id=sensor_id).exists()):
            return Response({'message': 'You are not allowed to delete this sensor'}, status=403)
        else:
            return Response({'message': 'Sensor does not exist'}, status=444)
    
class RegisterSensorView(generics.CreateAPIView):
    # register a sensor by getting the data field add_sensor_pin from request and compare it with the user's add_sensor_pin
    # if they match, create a new sensor and return the sensor_id and access_token (the sensor will send the pin to the end point)
    def post(self, request: Request, **kwargs: Any) -> Response:
        add_sensor_pin: str = request.data.get('add_sensor_pin')
        # get user by comparing the add_sensor_pin
        try:
            user: th_User = th_User.objects.get(add_sensor_pin=add_sensor_pin)
            # check if pin expired
            if user.is_pin_expired():
                user.set_pin(None)
                return Response({'message': 'PIN expired'}, status=400)
        except th_User.DoesNotExist:
            return Response({'message': 'Invalid PIN'}, status=400)
        # generate access token within the serializer
        sensor: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.create(user_id_owner=user)
        serializer: SensorDetailsSerializer = SensorDetailsSerializer.generate_token(self, sensor)
        serializer.save()
        return Response({
            'sensor_id': f'{serializer.id}',
            'access_token': f'{serializer.access_token}'
            }, status=201)
    
class UpdateSensorDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request: Request, **kwargs: Any) -> Response:
        sensor_id: int = kwargs.get('pk')
        sensor: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.filter(id=sensor_id).first()
        if not sensor:
            return Response({'message': 'Sensor does not exist'}, status=444)
        user: th_User = request.user
        sensor_owner: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).first()
        if not sensor_owner and not sensor.allow_group_admins_to_edit:
            # check if user is a member of the group where the sensor is shared
            sensor_group_ids: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
            for group_id in sensor_group_ids:
                group_admins: QuerySet[GroupAdmins] = GroupAdmins.objects.filter(group_id=group_id.group_id)
                if user.id in group_admins.admins_id.all(): # <-- to check
                    break  
                else:
                    return Response({'message': 'You are not allowed to edit this sensor'}, status=403) 
        elif sensor_owner:
            serializer: UserInteractionTemperatureHumiditySensorDetails = UserInteractionTemperatureHumiditySensorDetails(UserInteractionTemperatureHumiditySensorDetails().update(sensor, request.data))
            return Response(serializer.data)
        else:
            return Response({'message': 'You are not allowed to edit this sensor'}, status=403)
  
class SensorDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, **kwargs: Any) -> Response:
        sensor_id: int = kwargs.get('pk')
        user: th_User = request.user
        if not TemperatureHumiditySensorDetails.objects.filter(id=sensor_id).exists():
            return Response({'message': 'Sensor does not exist'}, status=204)
        sensor: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.get(id=sensor_id, user_id_owner=user.id)
        if not sensor:
            sensor_group_ids: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(id=sensor_id)
            for group_id in sensor_group_ids:
                group_members: QuerySet[GroupMembers] = GroupMembers.objects.filter(id=group_id)
                if user.id in group_members.member_id.all():
                    if sensor:
                        serializer: UserInteractionTemperatureHumiditySensorDetails = UserInteractionTemperatureHumiditySensorDetails(sensor)
                        return Response(serializer.data)
            return Response({'message': 'You are not allowed to view this sensor data'}, status=403)

        if sensor:
            serializer: UserInteractionTemperatureHumiditySensorDetails = UserInteractionTemperatureHumiditySensorDetails(sensor)
            return Response(serializer.data)
        else:
            return Response({'message': 'Sensor does not exist'}, status=444)
       
class EditSensorDetailsView(APIView):
    #permission_classes = [IsAuthenticated]
    def put(self, request: Request, **kwargs: Any) -> Response:
        sensor_id: int = kwargs.get('pk')
        user: th_User = request.user
        sensor: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user.id).first()
        if(TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).exists()):
            serializer: UserInteractionTemperatureHumiditySensorDetails = UserInteractionTemperatureHumiditySensorDetails(UserInteractionTemperatureHumiditySensorDetails().update(sensor, request.data))
            return Response(serializer.data, status=201)
        else:
            if(GroupLinkedSensors.objects.filter(sensor_id=sensor_id).exists()):
                sensor_group_ids: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(sensor_id=sensor_id)
                for group_id in sensor_group_ids:
                    group_members: QuerySet[GroupMembers] = GroupMembers.objects.filter(group_id=group_id.group_id)
                    if user.id in group_members.member_id.all():
                        serializer: UserInteractionTemperatureHumiditySensorDetails = UserInteractionTemperatureHumiditySensorDetails(UserInteractionTemperatureHumiditySensorDetails().update(sensor, request.data))
                        return Response({'message': 'Sensor details updated', 'data': serializer.data}, status=201)
                    else:
                        return Response({'message': 'You are not allowed to view this sensor data'}, status=403)
            else:
                return Response({'message': 'Sensor does not exist'}, status=444)   
        
class MySensorsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request) -> Response:
        user: th_User = request.user
        sensors: QuerySet[TemperatureHumiditySensorDetails] = TemperatureHumiditySensorDetails.objects.filter(user_id_owner=user.pk)
        if(sensors):
            serializer: UserInteractionTemperatureHumiditySensorDetails = UserInteractionTemperatureHumiditySensorDetails(sensors, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'You have no sensors'}, status=204)

class AccessibleSensorView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request) -> Response:
        user: th_User = request.user
        #check in user's groups and sensors in them
        group_ids: QuerySet[GroupMembers] = GroupMembers.objects.filter(member_id=user)
        if(group_ids):
            for group_id in group_ids:
                sensors: QuerySet[GroupLinkedSensors] = GroupLinkedSensors.objects.filter(group_id=group_id.group_id)
                for sensor in sensors:
                    sensor_details: QuerySet[TemperatureHumiditySensorDetails] = TemperatureHumiditySensorDetails.objects.filter(id=sensor.sensor_id)
                    serializer: UserInteractionTemperatureHumiditySensorDetails = UserInteractionTemperatureHumiditySensorDetails(sensor_details, many=True)
                    return Response(serializer.data)
        else:
            return Response({'message': 'You have no visible group sensors'}, status=444)
        
class MyLenSensorsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request) -> Response:
        user: th_User = request.user
        sensors: QuerySet[TemperatureHumiditySensorDetails] = TemperatureHumiditySensorDetails.objects.filter(user_id_owner=user)
        if(sensors):
            return Response({'number_of_sensors': f'{len(sensors)}'})
        else:
            return Response({'message': 'You have no sensors'}, status=444)

class FavoriteSensorView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request: Request, **kwargs: Any) -> Response:
        sensor_id: int = kwargs.get('pk')
        user: th_User = request.user
        sensor: TemperatureHumiditySensorDetails = TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=user).first()
        if not sensor:
            return Response({'message': 'Sensor does not exist'}, status=444)
        sensor.favorite = not sensor.favorite
        sensor.save()
        return Response({'message': 'Sensor favorite status updated'}, status=201)