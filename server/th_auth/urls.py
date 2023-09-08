from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', ThTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', ThTokenRefreshView.as_view(), name='token_refresh'),
    
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('password-reset/<uidb64>/<token>/', password_reset, name='password-reset'),
    path('logout/', logout, name='logout'),

    path('gen-pin/', generate_new_pin, name='generate-new-pin'),

    path('profile/', get_user_details, name='profile'),
    
    path('locked-test/', locked_endpoint, name='locked-test'),
]
