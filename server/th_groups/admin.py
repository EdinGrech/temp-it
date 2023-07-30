from django.contrib import admin
from .models import GroupDetails, GroupAdmins, GroupMembers, GroupLinkedSensors

class GroupDetailsAdmin(admin.ModelAdmin):
    list_display = ('group_id', 'group_name', 'group_creation_date', 'group_last_update_date')
    list_filter = ('group_creation_date', 'group_last_update_date')
    search_fields = ('group_name', 'group_description')
    list_per_page = 20

admin.site.register(GroupDetails, GroupDetailsAdmin)

class GroupAdminsAdmin(admin.ModelAdmin):
    list_display = ('group_id', 'get_admins')
    list_filter = ('group_id',)
    search_fields = ('group_id__group_name',)
    list_per_page = 20

    def get_admins(self, obj):
        return ', '.join([str(admin) for admin in obj.admins_id.all()])

    get_admins.short_description = 'Admins'

admin.site.register(GroupAdmins, GroupAdminsAdmin)

class GroupMembersAdmin(admin.ModelAdmin):
    list_display = ('group_id', 'get_members')
    list_filter = ('group_id',)
    search_fields = ('group_id__group_name',)
    list_per_page = 20

    def get_members(self, obj):
        return ', '.join([str(member) for member in obj.member_id.all()])

    get_members.short_description = 'Members'

admin.site.register(GroupMembers, GroupMembersAdmin)

class GroupLinkedSensorsAdmin(admin.ModelAdmin):
    list_display = ('group_id', 'get_linked_sensors')
    list_filter = ('group_id',)
    search_fields = ('group_id__group_name',)
    list_per_page = 20

    def get_linked_sensors(self, obj):
        return ', '.join([str(sensor) for sensor in obj.sensor_id.all()])

    get_linked_sensors.short_description = 'Linked Sensors'

admin.site.register(GroupLinkedSensors, GroupLinkedSensorsAdmin)

