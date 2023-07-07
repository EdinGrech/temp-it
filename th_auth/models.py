from django.utils import timezone
from django.contrib.auth.models import User
from th_sens.models import SensorDetails

from django.db import models

# over write user model
class th_User(User):
    add_sensor_pin = models.IntegerField()
    pin_created_at = models.DateTimeField(auto_now_add=True)

    def set_pin(self, pin):
        self.add_sensor_pin = pin
        self.pin_created_at = timezone.now()
        self.save()

    def is_pin_expired(self):
        expiration_time = self.pin_created_at + timezone.timedelta(hours=1)
        return timezone.now() > expiration_time


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
