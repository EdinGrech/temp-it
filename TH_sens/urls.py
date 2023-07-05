from django.urls import path
from .views import *

urlpatterns = [
    path('sensor', SensorReadingView.as_view()),
    path('sensor/<int:pk>', SensorReadingView.as_view()),
    path('sensor/<str:start_date>/<str:end_date>/<str:pks>', DateRangeSensorReadingView.as_view()),
    path('create-sensor', RegisterSensorView.as_view()),
    path('sensor-details/<int:pk>', SensorDetailsView.as_view()),
]