from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('password-reset/<uidb64>/<token>/', password_reset, name='password-reset'),
    path('logout/', logout_view, name='logout'),

    path('gen-pin/', generate_new_pin, name='generate-new-pin'),
    
    path('locked-test/', locked_endpoint, name='locked-test'),
]
