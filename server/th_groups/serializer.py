from rest_framework import serializers

from th_auth.models import th_User
from th_sens.models import SensorDetails, TemperatureHumiditySensorDetails
from .models import GroupDetails, GroupAdmins, GroupMembers, GroupLinkedSensors

class GroupDetailsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    creation_date = serializers.DateTimeField(read_only=True)
    owner = serializers.CharField(read_only=True)
    class Meta:
        model = GroupDetails
        fields = ['name', 'description', 'owner', 'creation_date']

class GroupAdminsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupAdmins
        fields = ['group', 'admins']

class GroupMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMembers
        fields = ['group', 'member']

class GroupLinkedSensorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupLinkedSensors
        fields = ['group', 'sensor']

class UserTHUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = th_User
        fields = ['username', 'email']

class TemperatureHumiditySensorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemperatureHumiditySensorDetails
        fields = ['id', 'date_created', 'name', 'location', 'description', 'active', 'active_alerts', 'high_temp_alert', 'low_temp_alert', 'high_humidity_alert', 'low_humidity_alert']
    

class UserGroupDetailedData(serializers.Serializer):
    group = GroupDetailsSerializer()
    admins = UserTHUserSerializer(many=True)
    members = UserTHUserSerializer(many=True)
    sensors = TemperatureHumiditySensorDetailsSerializer(many=True)

class UserGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupDetails
        fields = ['id', 'name', 'description']

class UserInGroups(serializers.Serializer):
    member_groups = UserGroupsSerializer(many=True)
    admin_groups = UserGroupsSerializer(many=True)
    