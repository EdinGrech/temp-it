from rest_framework import serializers
from .models import GroupDetails, GroupAdmins, GroupMembers, GroupLinkedSensors

class GroupDetailsSerializer(serializers.ModelSerializer):
    group_id = serializers.IntegerField(read_only=True)
    group_creation_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = GroupDetails
        fields = ['group_id', 'group_name', 'group_description', 'group_creation_date']

class GroupAdminsSerializer(serializers.ModelSerializer):
    group_id = serializers.IntegerField(read_only=True)
    # admin id linked to User id, 1 to 1 relationship fk
    admins_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = GroupAdmins
        fields = ['group_id', 'admins_id']

class GroupMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMembers
        fields = ['group_id', 'member_id']

class GroupLinkedSensorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupLinkedSensors
        fields = ['group_id', 'sensor_id']