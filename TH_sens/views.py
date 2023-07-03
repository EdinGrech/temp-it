from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Sensor
from .serializer import SensorSerializer

class SensorReading(APIView):
    def get(self, **kwargs):
        if kwargs.get('pk'):
            #return the last day's data for the sensor only
            sensor_id = kwargs.get('pk')
            sensor = Sensor.objects.filter(sensor_id=sensor_id).order_by('-date_time')[:24]
        else:
            #return the last day's data for all sensors
            sensor = Sensor.objects.all().order_by('-date_time')[:24]
        serializer = SensorSerializer(sensor, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = SensorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)

class DateRangeSensorReading(APIView):
    def get(self, request, **kwargs):
        start_date = kwargs.get('start_date')
        end_date = kwargs.get('end_date')
        sensor_ids = kwargs.get('pks')
        if sensor_ids == 'all':
            sensor = Sensor.objects.filter(date_time__range=[start_date, end_date]).order_by('-date_time')
            serializer = SensorSerializer(sensor, many=True)
            return Response(serializer.data)
        sensor_ids = sensor_ids.split(',')
        sensor = Sensor.objects.filter(sensor_id__in=sensor_ids, date_time__range=[start_date, end_date]).order_by('-date_time')
        serializer = SensorSerializer(sensor, many=True)
        return Response(serializer.data)
        
