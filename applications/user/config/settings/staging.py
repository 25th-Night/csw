import os

from .base import *


DEBUG = True

SERVICE_HOST = os.getenv("USER_SERVICE_HOST")
URL_SERVICE_HOST = os.getenv("URL_SERVICE_HOST")

SERVICE_DOMAIN = f"https://{SERVICE_HOST}"
URL_DOMAIN = f"https://{URL_SERVICE_HOST}"

ALLOWED_HOSTS += [
    SERVICE_HOST,
    URL_SERVICE_HOST,
]

CSRF_ALLOWED_ORIGINS += [
    SERVICE_DOMAIN,
    URL_DOMAIN,
]

CSRF_TRUSTED_ORIGINS += [
    SERVICE_DOMAIN,
    URL_DOMAIN,
]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "postgres"),
        "USER": os.getenv("POSTGRES_USER", "postgres"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
        "HOST": os.getenv("DB_HOST", "postgres"),
        "OPTIONS": {"options": "-c search_path=shortener,public"},
    }
}


# CORS settings

CORS_ORIGIN_WHITELIST += [
    SERVICE_DOMAIN,
    URL_DOMAIN,
]
CORS_ALLOWED_ORIGINS += [
    SERVICE_DOMAIN,
    URL_DOMAIN,
]


# COOKIE settings

# domain
DOMAIN = SERVICE_HOST

# Request DOMAIN
REQUEST_URL_DOMAIN = URL_DOMAIN

# secure
SECURE = True
