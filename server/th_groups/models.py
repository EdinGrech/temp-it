from django.db import models
from th_sens.models import SensorDetails
from th_auth.models import th_User

class GroupDetails(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class GroupAdmins(models.Model):
    group = models.OneToOneField(GroupDetails, on_delete=models.CASCADE)
    admins = models.ManyToManyField(th_User)

    def __str__(self):
        return self.group.name + " Admins"

class GroupMembers(models.Model):
    group = models.OneToOneField(GroupDetails, on_delete=models.CASCADE)
    member = models.ManyToManyField(th_User)

    def __str__(self):
        return self.group.name + " Members"

class GroupLinkedSensors(models.Model):
    group = models.OneToOneField(GroupDetails, on_delete=models.CASCADE)
    sensor = models.ManyToManyField(SensorDetails)

    def __str__(self):
        return self.group.name + " Linked Sensors"