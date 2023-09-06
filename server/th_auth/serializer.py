from rest_framework import serializers
from .models import th_User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = th_User
        fields = ['username', 'password', 'email']
        error_messages = {
            'username': {
                'unique': 'User with this username already exists.'
            },
            'email': {
                'unique': 'User with this email already exists.'
            }
        }
    
    def create(self, validated_data):
        user = th_User.objects.create_user(**validated_data)
        return user
    
class ThTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email

        return token    
