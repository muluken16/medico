from pathlib import Path
import os

# -------------------------------
# BASE DIRECTORY
# -------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------------
# SECURITY
# -------------------------------
SECRET_KEY = 'django-insecure-*4&7$7(8fwz7qot8e!85h_*_#p@c28=&5y6_!w7-tx5jktkpi('

# Detect environment
# HOSTNAME = os.environ.get('COMPUTERNAME', '')
# IS_LOCAL = HOSTNAME == 'MULE'

DEBUG = True 
ALLOWED_HOSTS = ['fullday.medicodigitals.com', 'localhost', '127.0.0.1']


# -------------------------------
# INSTALLED APPS
# -------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    # Your apps
    'api',
]

# -------------------------------
# MIDDLEWARE
# -------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be high up
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # For serving static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -------------------------------
# URLS & WSGI
# -------------------------------
ROOT_URLCONF = 'digital_marketing.urls'
WSGI_APPLICATION = 'digital_marketing.wsgi.application'

# -------------------------------
# TEMPLATES
# -------------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'frontend' / 'dist',
            BASE_DIR / 'staticfiles',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# -------------------------------
# DATABASE (SQLite)
# -------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# -------------------------------
# PASSWORD VALIDATORS
# -------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# -------------------------------
# INTERNATIONALIZATION
# -------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -------------------------------
# STATIC & MEDIA
# -------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles' 
STATICFILES_DIRS = [
    BASE_DIR / 'frontend' / 'dist',
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Cache headers for static/media
# WHITENOISE_MAX_AGE = 31536000 
WHITENOISE_KEEP_ONLY_HASHED_FILES = True

# -------------------------------
# DEFAULT PRIMARY KEY
# -------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -------------------------------
# CORS
# -------------------------------
CORS_ALLOW_ALL_ORIGINS = True

# -------------------------------
# REST FRAMEWORK
# -------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# -------------------------------
# EMAIL CONFIG
# -------------------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'mulukencs16@gmail.com'
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'iolj zngk jlif zgzn')  # App password
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
CONTACT_NOTIFY_EMAIL = 'contact@medicodigitals.com'

# TELEGRAM BOT CONFIGURATION
TELEGRAM_BOT_TOKEN = '8231921033:AAE41G7Fz1yhbtPKp1OecYNMc3uNmQA7Qx8'
