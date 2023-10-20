from django.contrib import admin
from .models import SensorDetails, SensorReading, TemperatureHumiditySensorDetails

class SensorDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'active', 'user_id_owner')
    list_filter = ('active', 'user_id_owner')
    search_fields = ('name', 'location', 'description')
    list_per_page = 20

admin.site.register(SensorDetails, SensorDetailsAdmin)

class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ('id', 'sensor_id', 'date_time', 'temperature', 'humidity')
    list_filter = ('sensor_id', 'date_time')
    search_fields = ('sensor_id__name', 'sensor_id__location', 'date_time')
    list_per_page = 20

admin.site.register(SensorReading, SensorReadingAdmin)

class TemperatureHumiditySensorDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'active', 'user_id_owner', 'active_alerts', 'favorite')
    list_filter = ('active', 'user_id_owner')
    search_fields = ('name', 'location', 'description')
    list_per_page = 20

admin.site.register(TemperatureHumiditySensorDetails, TemperatureHumiditySensorDetailsAdmin)






