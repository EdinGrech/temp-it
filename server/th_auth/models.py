from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models

class th_User(AbstractUser):
    add_sensor_pin = models.CharField(max_length=6, null=True, blank=True)
    pin_created_at = models.DateTimeField(auto_now_add=True)

    def set_pin(self, pin):
        self.add_sensor_pin = pin
        self.pin_created_at = timezone.now()
        self.save()

    def is_pin_expired(self):
        expiration_time = self.pin_created_at + timezone.timedelta(hours=1)
        return timezone.now() > expiration_time