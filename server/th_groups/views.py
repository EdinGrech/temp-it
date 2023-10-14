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
    name = request.data.get('name')
    description = request.data.get('description')
    # create the group
    group = GroupDetails.objects.create(
        name=name,
        description=description
    )
    # get the user who created the group
    user = request.user
    # add the user as an admin of the group
    group_admins = GroupAdmins.objects.create(
        group=group
    )
    group_admins.admins.add(user)
    # add the user as a member of the group
    group_members = GroupMembers.objects.create(
        group=group
    )
    group_members.member.add(user)
    # return the group details
    serializer = GroupDetailsSerializer(group)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# view for getting the details of a group
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_details(request, group):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # return the group details
    serializer = GroupDetailsSerializer(group)
    return Response(serializer.data)

# view for updating the details of a group
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_group_details(request, group):
    # get the group details
    group = GroupDetails.objects.get(group=group)
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
def delete_group(request, group):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins.all():
        # delete the group
        group.delete()
        return Response({'success': 'Group deleted successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding an admin to a group (only admins can add an admin to a group)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_admin(request, group):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins.all():
        # get the username of the admin to be added
        username = request.data.get('username')
        # get the user object of the admin to be added
        user = th_User.objects.get(username=username)
        # add the user as an admin of the group
        group_admins = GroupAdmins.objects.get(group=group)
        group_admins.admins.add(user)
        return Response({'success': 'Admin added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for removing an admin from a group (only admins can remove an admin from a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_admin(request, group):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins.all():
        # get the username of the admin to be removed
        username = request.data.get('username')
        # get the user object of the admin to be removed
        user = th_User.objects.get(username=username)
        # remove the user as an admin of the group
        group_admins = GroupAdmins.objects.get(group=group)
        group_admins.admins.remove(user)
        return Response({'success': 'Admin removed successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding a member to a group (only admins can add a member to a group) with username
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member_to_group_with_username(request, group):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins.all():
        # get the username of the member to be added
        username = request.data.get('username')
        # get the user object of the member to be added
        user = th_User.objects.get(username=username)
        # add the user as a member of the group
        group_members = GroupMembers.objects.get(group=group)
        group_members.member.add(user)
        return Response({'success': 'Member added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)

# view for removing a member from a group (only admins can remove a member from a group) with username
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_member_from_group_with_username(request, group):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins.all():
        # get the username of the member to be removed
        username = request.data.get('username')
        # get the user object of the member to be removed
        user = th_User.objects.get(username=username)
        # remove the user as a member of the group
        group_members = GroupMembers.objects.get(group=group)
        group_members.member.remove(user)
        return Response({'success': 'Member removed successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for adding a sensor to a group (only sensor owners can add a sensor to a group)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_sensor_to_group(request, group, sensor):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # check if the user is an admin of the group
    if request.user in group.groupadmins.admins.all():
        # get the sensor details
        sensor = SensorDetails.objects.get(sensor=sensor)
        # add the sensor to the group
        group_linked_sensors = GroupLinkedSensors.objects.get(group=group)
        group_linked_sensors.sensor.add(sensor)
        return Response({'success': 'Sensor added successfully'})
    else:
        return Response({'error': 'You are not an admin of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    
# view for removing a sensor from a group (only sensor owners or admins can remove a sensor from a group)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_sensor_from_group(request, group, sensor):
    # get the group details
    group = GroupDetails.objects.get(group=group)
    # check if the user is an admin of the group or the owner of the sensor
    if request.user in group.groupadmins.admins.all() or request.user in SensorDetails.objects.get(sensor=sensor).sensor_owner.all():
        # get the sensor details
        sensor = SensorDetails.objects.get(sensor=sensor)
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
    # Serialize the group memberships along with their details
    serializer = UserGroupsSerializer(groups, many=True)
    return Response(serializer.data)

# view list of admins of a group a user is in
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_admins(request, group):
    # get the group
    group = GroupDetails.objects.get(group=group)
    # get the admins of the group
    admins = GroupAdmins.objects.get(group=group)
    # return the admins
    serializer = GroupAdminsSerializer(admins)
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_members(request, group):
    # check if requestor is in group
    user = request.user
    group = GroupDetails.objects.get(group=group)
    if user not in group.groupmembers.member.all():
        return Response({'error': 'You are not a member of this group'}, status=status.HTTP_401_UNAUTHORIZED)
    members = GroupMembers.objects.get(group=group)
    # return the members
    serializer = GroupMembersSerializer(members)
    return Response(serializer.data)