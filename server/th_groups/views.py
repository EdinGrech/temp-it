from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from th_auth.models import th_User
from th_sens.models import SensorDetails, TemperatureHumiditySensorDetails

from .serializer import *

# view for creating a new group
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group(request):
    # get the group name and description from the request
    name = request.data.get('name')
    description = request.data.get('description')
    # create the group
    group = GroupDetails.objects.create(
        name=name,
        description=description,
        owner=request.user
    )
    # get the user who created the group
    user = request.user
    # add the user as an admin of the group
    group_admins = GroupAdmins.objects.create(
        group=group
    )
    group_admins.admins.add(user)
    serializer = GroupDetailsSerializer(group)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# view for getting the details of a group
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_details(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(id=group_id)
    admins = GroupAdmins.objects.filter(group=group).values('admins')
    admins = th_User.objects.filter(id__in=admins)
    admins = UserTHUserSerializer(admins, many=True).data

    members = GroupMembers.objects.filter(group=group).values('member')
    members = th_User.objects.filter(id__in=members)
    members = UserTHUserSerializer(members, many=True).data

    sensors = GroupLinkedSensors.objects.filter(group=group).values('sensor')
    sensors = TemperatureHumiditySensorDetails.objects.filter(id__in=sensors)
    sensors = TemperatureHumiditySensorDetailsSerializer(sensors, many=True).data
    
    data = {
        'group': group,
        'admins': admins,
        'members': members,
        'sensors': sensors
    }
    # return the group details
    serializer:UserGroupDetailedData = UserGroupDetailedData(data)
    return Response(serializer.data)

# view for updating the details of a group
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_group_details(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(id=group_id)
    # update the group details
    group.name = request.data.get('name')
    group.description = request.data.get('description')
    group.save()
    # return the group details
    serializer = GroupDetailsSerializer(group)
    return Response(serializer.data)

# view for deleting a group (only admins can delete a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(id=group_id)
    # check if the user is an admin of the group
    if request.user == group.owner:
        # delete the group
        group.delete()
        return Response({'success': 'Group deleted successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding an admin to a group (only admins can add an admin to a group)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_admin(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(id=group_id)
    if request.user == group.owner:
        # get the username of the admin to be added
        username = request.data.get('username')
        # get the user object of the admin to be added
        user = th_User.objects.get(username=username)
        # add the user as an admin of the group
        if GroupMembers.objects.filter(group=group, member=user).exists():
            # remove the user as a member of the group
            group_member = get_object_or_404(GroupMembers, group_id=group_id, member_id=user.id)
            group_member.delete()
        if GroupAdmins.objects.filter(group=group, admins=user).exists():
            return Response({'error': 'User is already a admin of the group'}, status=status.HTTP_400_BAD_REQUEST)
        
        group_admins = GroupAdmins.objects.create(group=group)
        group_admins.admins.add(user)
        return Response({'success': 'Admin added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for removing an admin from a group (only admins can remove an admin from a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_admin(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(id=group_id)
    # check if the user is an admin of the group
    if request.user == group.owner:
        # get the username of the admin to be removed
        username = request.data.get('username')
        user = get_object_or_404(th_User, username=username)

        if user == group.owner:
            return Response({'error': 'You cannot remove the owner of the group'}, status=status.HTTP_400_BAD_REQUEST)
        
        # remove the user as an admin of the group
        group_admins = get_object_or_404(GroupAdmins, group=group, admins=user)
        group_admins.delete()

        # make user a member of the group
        group_members = GroupMembers.objects.create(group=group)
        group_members.member.add(user)

        return Response({'success': 'Admin removed successfully'})
    else:
        return Response({'error': 'You are not the owner of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding a member to a group (only admins can add a member to a group) with username
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member_to_group_with_username(request, group_id):
    # get the group details
    group = get_object_or_404(GroupDetails, id=group_id)
    admins = GroupAdmins.objects.filter(group=group).values('admins')
    admins = get_list_or_404(th_User, id__in=admins)
    # check if the user is an admin of the group
    if request.user in admins:
        # get the username of the member to be added
        username = request.data.get('username')
        # get the user object of the member to be added
        user = get_object_or_404(th_User, username=username)
        # add the user as a member of the group
        if GroupMembers.objects.filter(group=group, member=user).exists() or GroupAdmins.objects.filter(group=group, admins=user).exists():
            return Response({'error': 'User is already in the group'}, status=status.HTTP_400_BAD_REQUEST)
        group_members = GroupMembers.objects.create(group=group)
        group_members.member.add(user)
        return Response({'success': 'Member added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)

# view for removing a member from a group (only admins can remove a member from a group) with username
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_member_from_group_with_username(request, group_id):
    # get the group details
    group = get_object_or_404(GroupDetails, id=group_id)
    admins = GroupAdmins.objects.filter(group=group).values('admins')
    admins = get_list_or_404(th_User, id__in=admins)
    # check if the user is an admin of the group
    if request.user in admins:
        # get the username of the member to be removed
        username = request.data.get('username')
        # get the user object of the member to be removed
        user = th_User.objects.get(username=username)
        # remove the user as a member of the group
        group_member = get_object_or_404(GroupMembers, group=group, member=user)
        group_member.delete()
        return Response({'success': 'Member removed successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding a sensor to a group (only sensor owners can add a sensor to a group)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_sensor_to_group(request, group_id, sensor_id):
    # get the group details
    group = get_object_or_404(GroupDetails, id=group_id)
    admins = GroupAdmins.objects.filter(group=group).values('admins')
    admins = get_list_or_404(th_User, id__in=admins)
    # check if the user is an admin of the group
    if request.user in admins:
        # get the sensor details
        if not TemperatureHumiditySensorDetails.objects.filter(id=sensor_id, user_id_owner=request.user.id).exists():
            return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        sensor = TemperatureHumiditySensorDetails.objects.get(id=sensor_id, user_id_owner=request.user.id)
        # add the sensor to the group
        group_linked_sensors = GroupLinkedSensors.objects.create(group=group)
        group_linked_sensors.sensor.add(sensor)
        return Response({'success': 'Sensor added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for removing a sensor from a group (only sensor owners or admins can remove a sensor from a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_sensor_from_group(request, group_id, sensor_id):
    # get the group details
    group = get_object_or_404(GroupDetails, id=group_id)
    admins = GroupAdmins.objects.filter(group=group).values('admins')
    admins = get_list_or_404(th_User, id__in=admins)
    # check if the user is an admin of the group
    if request.user in admins or request.user in TemperatureHumiditySensorDetails.objects.get(id=sensor_id).sensor_owner.all():
        # get the sensor details
        sensor = TemperatureHumiditySensorDetails.objects.get(id=sensor_id)
        # remove the sensor from the group
        group_linked_sensors = GroupLinkedSensors.objects.get(group=group)
        group_linked_sensors.sensor.remove(sensor)
        return Response({'success': 'Sensor removed successfully'})
    else:
        return Response({'error': 'You are not an admin of this group or the owner of the sensor'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for user to see list of groups they are a member of
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_groups(request):
    # get the user
    user = request.user
    # Get the groups the user is a member of along with their details
    groups:GroupMembers = GroupMembers.objects.filter(member=user)
    groups:GroupDetails = [group.group for group in groups]
    groups = UserGroupsSerializer(groups, many=True)
    
    admin_groups:GroupAdmins = GroupAdmins.objects.filter(admins=user)
    admin_groups:GroupDetails = [group.group for group in admin_groups]
    admin_groups = UserGroupsSerializer(admin_groups, many=True)

    data = {
        'member_groups': groups.data,
        'admin_groups': admin_groups.data
    }
    serializer:UserInGroups = UserInGroups(data)
    return Response(serializer.data)

# view with a check to see if user is admin of a group
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_user_admin_of_group(request, group):
    # get the group
    group = GroupAdmins.objects.get(group=group)
    # check if the user is an admin of the group
    if request.user in group.admins.all():
        return Response({'admin': True})
    else:
        return Response({'admin': False})