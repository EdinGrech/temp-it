from django.contrib import admin
from .models import GroupDetails, GroupAdmins, GroupMembers, GroupLinkedSensors

class GroupDetailsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'creation_date', 'last_update_date')
    list_filter = ('creation_date', 'last_update_date')

class GroupAdminsAdmin(admin.ModelAdmin):
    list_display = ('group', 'admins_list')
    
    def admins_list(self, obj):
        return ", ".join([admin.username for admin in obj.admins.all()])

class GroupMembersAdmin(admin.ModelAdmin):
    list_display = ('group', 'members_list')
    
    def members_list(self, obj):
        return ", ".join([member.username for member in obj.member.all()])

class GroupLinkedSensorsAdmin(admin.ModelAdmin):
    list_display = ('group', 'sensors_list')
    
    def sensors_list(self, obj):
        return ", ".join([sensor.sensor_name for sensor in obj.sensor.all()])

# Register your models with their respective admin classes
admin.site.register(GroupDetails, GroupDetailsAdmin)
admin.site.register(GroupAdmins, GroupAdminsAdmin)
admin.site.register(GroupMembers, GroupMembersAdmin)
admin.site.register(GroupLinkedSensors, GroupLinkedSensorsAdmin)