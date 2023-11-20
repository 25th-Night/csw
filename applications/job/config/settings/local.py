from .base import *


SERVICE_DOMAIN = f"http://{SERVICE_HOST}:83"
USER_DOMAIN = f"http://{USER_SERVICE_HOST}:81"

ALLOWED_HOSTS += [
    "job",
]

CSRF_ALLOWED_ORIGINS += [
    USER_DOMAIN,
    SERVICE_DOMAIN,
    "http://job:8000",
]

CSRF_TRUSTED_ORIGINS += [
    USER_DOMAIN,
    SERVICE_DOMAIN,
    "http://job:8000",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "postgres"),
        "USER": os.getenv("POSTGRES_USER", "postgres"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
        "HOST": os.getenv("DB_HOST", "postgres"),
        "OPTIONS": {"options": "-c search_path=job,public"},
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


# CHROME DRIVER Path
CHROME_DRIVER = os.getenv("CHROME_DRIVER", None)
