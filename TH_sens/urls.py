from django.urls import path
from .views import *

urlpatterns = [
    path('sensor/', SensorReading.as_view()),
    path('sensor/<int:pk>/', SensorReading.as_view()),
    path('sensor/<str:start_date>/<str:end_date>/<str:pks>/', DateRangeSensorReading.as_view()),
    path('sensor/<str:start_date>/<str:end_date>/', DateRangeSensorReading.as_view()),
]