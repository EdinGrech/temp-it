import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


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


# view for generating a new access token for a sensor
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_new_pin(request):
    # create a randome pin, save it to the user and return it
    user:th_User = request.user
    # print user object type 
    print(type(user))
    # create a new pin
    pin = random.randint(100000, 999999)
    # save the pin to the user
    user.set_pin(pin)
    # return the pin
    return Response({'pin': pin})
    

    
