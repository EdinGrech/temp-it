from django.urls import path
from .views import *

urlpatterns = [
    path('sensor', SensorReadingView.as_view()),

    path('my-sensors', MySensorsView.as_view()),
    path('my-sensors-count', MyLenSensorsView.as_view()),
    path('accessible-sensors', AccessibleSensorView.as_view()),
    path('delete-sensor/<int:pk>', DeleteSensorView.as_view()),

    path('sensor/<int:pk>', LastDaySensorReadingView.as_view()),
    path('sensor/<int:pk>/last-reading', LastSensorReadingView.as_view()),
    path('sensor/<str:start_date>/<str:end_date>/<int:pk>', depDateRangeSensorReadingView.as_view()),# to deprecate
    path('sensor/date-range/<int:pk>', DateRangeSensorReadingView.as_view()),
    
    path('create-sensor', RegisterSensorView.as_view()),
    path('sensor-details/<int:pk>', SensorDetailsView.as_view()),
    path('sensor-details/<int:pk>/update', EditSensorDetailsView.as_view()),
]