from rest_framework import serializers
from .models import th_User
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = th_User
        fields = ['username', 'password', 'email']
    
    def create(self, validated_data):
        user = th_User.objects.create_user(**validated_data)
        return user
    
