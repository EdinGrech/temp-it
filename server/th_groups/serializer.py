from rest_framework import serializers

from th_auth.models import th_User
from .models import GroupDetails, GroupAdmins, GroupMembers, GroupLinkedSensors

class GroupDetailsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    creation_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = GroupDetails
        fields = ['name', 'description', 'creation_date']

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

# Serializer to return user groups with group details
class UserGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupDetails
        fields = ['id', 'name', 'description']

class UserTHUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = th_User
        fields = ['username', 'email']

class UserGroupDetailedData(serializers.Serializer):
    group = GroupDetailsSerializer()
    admins = UserTHUserSerializer(many=True)
    members = UserTHUserSerializer(many=True)