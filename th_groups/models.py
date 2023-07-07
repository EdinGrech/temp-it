from django.db import models
from th_sens.models import SensorDetails
from th_auth.models import th_User

class GroupDetails(models.Model):
    group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=50)
    group_description = models.CharField(max_length=200)
    group_creation_date = models.DateTimeField(auto_now_add=True)
    group_last_update_date = models.DateTimeField(auto_now=True)

class GroupAdmins(models.Model):
    group_id = models.OneToOneField(GroupDetails, on_delete=models.CASCADE)
    admins_id = models.ManyToManyField( th_User, related_name='group_admins')

class GroupMembers(models.Model):
    group_id = models.OneToOneField(GroupDetails, on_delete=models.CASCADE)
    member_id = models.ManyToManyField( th_User, related_name='group_members')

class GroupLinkedSensors(models.Model):
    group_id = models.OneToOneField(GroupDetails, on_delete=models.CASCADE)
    sensor_id = models.ManyToManyField(SensorDetails, related_name='group_linked_sensors')
