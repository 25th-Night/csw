from .base import *


SERVICE_DOMAIN = f"http://{SERVICE_HOST}:82"
URL_DOMAIN = f"http://{URL_SERVICE_HOST}:81"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "postgres"),
        "USER": os.getenv("POSTGRES_USER", "postgres"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
        "HOST": os.getenv("DB_HOST", "postgres"),
        "OPTIONS": {"options": "-c search_path=user,public"},
    }
}


# CORS settings

CORS_ORIGIN_WHITELIST += [
    URL_DOMAIN,
    SERVICE_DOMAIN,
]
CORS_ALLOWED_ORIGINS += [
    URL_DOMAIN,
    SERVICE_DOMAIN,
]

# Request DOMAIN
REQUEST_URL_DOMAIN = "http://shortener:8000"
