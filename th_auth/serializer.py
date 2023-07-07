from rest_framework import serializers
from .models import GroupDetails, GroupAdmins, GroupMembers, GroupLinkedSensors, th_User
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = th_User
        fields = ['username', 'password', 'email']
    
    def create(self, validated_data):
        user = th_User.objects.create_user(**validated_data)
        return user
    
class GroupDetailsSerializer(serializers.ModelSerializer):
    group_id = serializers.IntegerField(read_only=True)
    group_creation_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = GroupDetails
        fields = ['group_id', 'group_name', 'group_description', 'group_creation_date']

class GroupAdminsSerializer(serializers.ModelSerializer):
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