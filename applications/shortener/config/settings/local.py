from .base import *


SERVICE_DOMAIN = f"http://{SERVICE_HOST}:82"
USER_DOMAIN = f"http://{USER_SERVICE_HOST}:81"

ALLOWED_HOSTS += [
    "shortener",
]

CSRF_ALLOWED_ORIGINS += [
    "shortener",
]

CSRF_TRUSTED_ORIGINS += [
    "shortener",
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


# Request DOMAIN
REQUEST_USER_DOMAIN = "http://user:8000"
