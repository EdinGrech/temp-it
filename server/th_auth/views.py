import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from temp_it.settings.prod import DEFAULT_FROM_EMAIL

from .serializer import *

from django.template.loader import render_to_string

from django.contrib.auth import authenticate, login, logout
from th_auth.models import th_User
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site

from django.core.mail import send_mail

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.views import TokenRefreshView

class ThTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': 'Invalid token or token not found'}, status=443)
class ThTokenObtainPairView(TokenObtainPairView):
    serializer_class = ThTokenObtainPairSerializer

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate access token
        access_token_serializer = ThTokenObtainPairSerializer(data={
            'email': request.data.get('email'),
            'password': request.data.get('password')
        })
        if access_token_serializer.is_valid():
            access_token = access_token_serializer.validated_data['access']

            refresh_token = RefreshToken.for_user(user)

            response_data = {
                'access': str(access_token),
                'refresh': str(refresh_token),
                'user_data': serializer.data
            }            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Blacklist the refresh token, which will also invalidate the associated access token
        token = RefreshToken(request.data['refresh'])
        token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token or token not found'}, status=status.HTTP_400_BAD_REQUEST)

# view for generating a new access token for a sensor
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_new_pin(request):
    # create a random pin, save it to the user and return it
    user:th_User = request.user
    # create a new pin
    pin = random.randint(10000000, 99999999)
    # save the pin to the user
    user.set_pin(pin)
    # return the pin
    return Response({'pin': pin})

# get user details from token
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)
    

    
