from django.urls import path
from .views import *

urlpatterns = [
    path('create-group/', create_group, name='create-group'),
    path('get-group/<int:group_id>/', get_group_details, name='get-group'),
    path('update-group/<int:group_id>/', update_group_details, name='update-group'),
    path('delete-group/<int:group_id>/', delete_group, name='delete-group'),
    
    path('add-admin/<int:group_id>/', add_admin, name='add-admin'),
    path('remove-admin/<int:group_id>/', remove_admin, name='remove-admin'),
    path('add-member/<int:group_id>/', add_member_to_group_with_username, name='add-member'),
    path('remove-member/<int:group_id>/', remove_member_from_group_with_username, name='remove-member'),
    path('add-sensor/<int:group_id>/<int:sensor_id>/', add_sensor_to_group, name='add-sensor'),
    path('remove-sensor/<int:group_id>/<int:sensor_id>/', remove_sensor_from_group, name='remove-sensor')
]