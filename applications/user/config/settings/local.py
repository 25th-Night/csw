from .base import *


SERVICE_DOMAIN = f"http://{SERVICE_HOST}:82"
URL_DOMAIN = f"http://{URL_SERVICE_HOST}:81"

CSRF_ALLOWED_ORIGINS += [
    URL_DOMAIN,
    SERVICE_DOMAIN,
]

CSRF_TRUSTED_ORIGINS += [
    URL_DOMAIN,
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
        "OPTIONS": {"options": "-c search_path=user,public"},
    }
}
