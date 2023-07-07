import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from th_sens.models import SensorDetails


from temp_it.settings import DEFAULT_FROM_EMAIL

from .serializer import *

from django.template.loader import render_to_string

from django.contrib.auth import authenticate, login, logout
from th_auth.models import th_User
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site

from django.core.mail import send_mail

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        response_data = {
            'username': user.username,
            'email': user.email,
            'token': access_token
        }
        return Response(response_data)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    
@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    try:
        user = th_User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        current_site = get_current_site(request)
        mail_subject = 'Reset your password'
        message = render_to_string(
            'reset_password_email.html',
            {
                'user': user,
                'domain': current_site.domain,
                'uid': uid,
                'token': token,
            }
        )
        send_mail(mail_subject, message, DEFAULT_FROM_EMAIL, [email])
        return Response({'success': 'Email sent'})
    except th_User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def password_reset(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = th_User.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            user.set_password(new_password)
            user.save()
            return Response({'success': 'Password reset successful'})
        else:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except th_User.DoesNotExist:
        return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def locked_endpoint(request):
    return Response({'message': 'Access granted to the locked endpoint'})

# from rest_framework.authentication import SessionAuthentication
# from rest_framework.permissions import IsAuthenticated
# class MyLockedView(APIView):
#     authentication_classes = [SessionAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'success': 'User logged out successfully'})

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
    
# view for generating a new access token for a sensor
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_new_access_token(request):
    # create a randome pin, save it to the user and return it
    user = request.user
    # check if the user has a pin & if it is expired
    if user.add_sensor_pin and not user.is_pin_expired():
        return Response({'error': 'You already have a pin'})
    else:
        # create a new pin
        pin = random.randint(100000, 999999)
        # save the pin to the user
        user.set_pin(pin)
        # return the pin
        return Response({'pin': pin})
    

    
