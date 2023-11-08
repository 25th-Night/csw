import os

from .base import *


DEBUG = False


SERVICE_HOST = os.getenv("URL_SERVICE_HOST")
USER_SERVICE_HOST = os.getenv("USER_SERVICE_HOST")

SERVICE_DOMAIN = f"https://{SERVICE_HOST}"
USER_DOMAIN = f"https://{USER_SERVICE_HOST}"

ALLOWED_HOSTS += [
    SERVICE_HOST,
    USER_SERVICE_HOST,
]

CSRF_ALLOWED_ORIGINS += [
    USER_DOMAIN,
    SERVICE_DOMAIN,
]

CSRF_TRUSTED_ORIGINS += [
    USER_DOMAIN,
    SERVICE_DOMAIN,
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
    USER_DOMAIN,
    SERVICE_DOMAIN,
]
CORS_ALLOWED_ORIGINS += [
    USER_DOMAIN,
    SERVICE_DOMAIN,
]


# COOKIE settings

# domain
DOMAIN = USER_SERVICE_HOST

# secure
SECURE = True
