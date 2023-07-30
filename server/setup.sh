#!/bin/sh

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser if it doesn't already exist
python manage.py shell <<EOF
from th_auth.models import th_User
if not th_User.objects.filter(username='$SUPERUSER_USERNAME').exists():
    th_User.objects.create_superuser('$SUPERUSER_USERNAME', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWORD')
EOF

# Run the server
python manage.py runserver 0.0.0.0:8000
