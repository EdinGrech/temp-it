from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('password-reset/<uidb64>/<token>/', password_reset, name='password-reset'),
]
