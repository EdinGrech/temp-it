from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class th_UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

class th_User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    # Additional custom fields specific to your project
    add_sensor_pin = models.CharField(max_length=8, null=True, blank=True)
    pin_created_at = models.DateTimeField(auto_now_add=True)

    objects = th_UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def set_pin(self, pin):
        self.add_sensor_pin = pin
        self.pin_created_at = timezone.now()
        self.save()

    def is_pin_expired(self):
        expiration_time = self.pin_created_at + timezone.timedelta(hours=1)
        return timezone.now() > expiration_time
