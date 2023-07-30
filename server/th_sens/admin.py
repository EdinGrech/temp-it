from django.contrib import admin
from .models import SensorDetails, SensorReading

class SensorDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'active', 'user_id_owner')
    list_filter = ('active', 'user_id_owner')
    search_fields = ('name', 'location', 'description')
    list_per_page = 20

admin.site.register(SensorDetails, SensorDetailsAdmin)

class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ('id', 'sensor_id', 'date_time', 'temperature', 'humidity')
    list_filter = ('sensor_id', 'date_time')
    search_fields = ('sensor_id__name', 'sensor_id__location')
    list_per_page = 20

admin.site.register(SensorReading, SensorReadingAdmin)

