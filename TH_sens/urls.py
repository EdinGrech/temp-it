from django.urls import path
from .views import *

urlpatterns = [
    path('sensor', SensorReadingView.as_view()),
    path('sensor/<int:pk>', SensorReadingView.as_view()),
    path('sensor/<str:start_date>/<str:end_date>/<int:pk>', DateRangeSensorReadingView.as_view()),
    path('create-sensor', RegisterSensorView.as_view()),
        # {"add_sensor_pin": "1234567", 
        #  "name": "test", 
        #  "location": "test", 
        #  "description": "test", 
        #  "active": true}
    path('sensor-details/<int:pk>', SensorDetailsView.as_view()),
]