import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_marketing.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = 'admin'
email = 'admin@medicodigitals.com'
password = 'adminpassword123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created successfully!")
else:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"Superuser '{username}' already exists. Password updated to '{password}'.")
