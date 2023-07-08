from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from th_auth.models import th_User
from th_sens.models import SensorDetails

from .serializer import *

# view for creating a new group
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group(request):
    # get the group name and description from the request
    group_name = request.data.get('group_name')
    group_description = request.data.get('group_description')
    # create the group
    group = GroupDetails.objects.create(
        group_name=group_name,
        group_description=group_description
    )
    # get the user who created the group
    user = request.user
    # add the user as an admin of the group
    group_admins = GroupAdmins.objects.create(
        group_id=group
    )
    group_admins.admins_id.add(user)
    # add the user as a member of the group
    group_members = GroupMembers.objects.create(
        group_id=group
    )
    group_members.member_id.add(user)
    # return the group details
    serializer = GroupDetailsSerializer(group)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# view for getting the details of a group
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_details(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # return the group details
    serializer = GroupDetailsSerializer(group)
    return Response(serializer.data)

# view for updating the details of a group
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_group_details(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # update the group details
    group.group_name = request.data.get('group_name')
    group.group_description = request.data.get('group_description')
    group.save()
    # return the group details
    serializer = GroupDetailsSerializer(group)
    return Response(serializer.data)

# view for deleting a group (only admins can delete a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins_id.all():
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
    group = GroupDetails.objects.get(group_id=group_id)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins_id.all():
        # get the username of the admin to be added
        username = request.data.get('username')
        # get the user object of the admin to be added
        user = th_User.objects.get(username=username)
        # add the user as an admin of the group
        group_admins = GroupAdmins.objects.get(group_id=group)
        group_admins.admins_id.add(user)
        return Response({'success': 'Admin added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for removing an admin from a group (only admins can remove an admin from a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_admin(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins_id.all():
        # get the username of the admin to be removed
        username = request.data.get('username')
        # get the user object of the admin to be removed
        user = th_User.objects.get(username=username)
        # remove the user as an admin of the group
        group_admins = GroupAdmins.objects.get(group_id=group)
        group_admins.admins_id.remove(user)
        return Response({'success': 'Admin removed successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding a member to a group (only admins can add a member to a group) with username
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member_to_group_with_username(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins_id.all():
        # get the username of the member to be added
        username = request.data.get('username')
        # get the user object of the member to be added
        user = th_User.objects.get(username=username)
        # add the user as a member of the group
        group_members = GroupMembers.objects.get(group_id=group)
        group_members.member_id.add(user)
        return Response({'success': 'Member added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)

# view for removing a member from a group (only admins can remove a member from a group) with username
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_member_from_group_with_username(request, group_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins_id.all():
        # get the username of the member to be removed
        username = request.data.get('username')
        # get the user object of the member to be removed
        user = th_User.objects.get(username=username)
        # remove the user as a member of the group
        group_members = GroupMembers.objects.get(group_id=group)
        group_members.member_id.remove(user)
        return Response({'success': 'Member removed successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding a sensor to a group (only sensor owners can add a sensor to a group)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_sensor_to_group(request, group_id, sensor_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins_id.all():
        # get the sensor details
        sensor = SensorDetails.objects.get(sensor_id=sensor_id)
        # add the sensor to the group
        group_linked_sensors = GroupLinkedSensors.objects.get(group_id=group)
        group_linked_sensors.sensor_id.add(sensor)
        return Response({'success': 'Sensor added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for removing a sensor from a group (only sensor owners or admins can remove a sensor from a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_sensor_from_group(request, group_id, sensor_id):
    # get the group details
    group = GroupDetails.objects.get(group_id=group_id)
    # check if the user is an admin of the group or the owner of the sensor
    if request.user in group.groupadmins.admins_id.all() or request.user in SensorDetails.objects.get(sensor_id=sensor_id).sensor_owner.all():
        # get the sensor details
        sensor = SensorDetails.objects.get(sensor_id=sensor_id)
        # remove the sensor from the group
        group_linked_sensors = GroupLinkedSensors.objects.get(group_id=group)
        group_linked_sensors.sensor_id.remove(sensor)
        return Response({'success': 'Sensor removed successfully'})
    else:
        return Response({'error': 'You are not an admin of this group or the owner of the sensor'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for user to see list of groups they are a member of
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_groups(request):
    # get the user
    user = request.user
    # get the groups the user is a member of
    groups = GroupMembers.objects.filter(member_id=user)
    # return the groups
    serializer = GroupMembersSerializer(groups, many=True)
    return Response(serializer.data)

# view list of admins of a group a user is in
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_admins(request, group_id):
    # get the group
    group = GroupDetails.objects.get(group_id=group_id)
    # get the admins of the group
    admins = GroupAdmins.objects.get(group_id=group)
    # return the admins
    serializer = GroupAdminsSerializer(admins)
    return Response(serializer.data)

# view with a check to see if user is admin of a group
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_user_admin_of_group(request, group_id):
    # get the group
    group = GroupAdmins.objects.get(group_id=group_id)
    # check if the user is an admin of the group
    if request.user in group.admins_id.all():
        return Response({'admin': True})
    else:
        return Response({'admin': False})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_members(request, group_id):
    # check if requestor is in group
    user = request.user
    group = GroupDetails.objects.get(group_id=group_id)
    if user not in group.groupmembers.member_id.all():
        return Response({'error': 'You are not a member of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    members = GroupMembers.objects.get(group_id=group)
    # return the members
    serializer = GroupMembersSerializer(members)
    return Response(serializer.data)