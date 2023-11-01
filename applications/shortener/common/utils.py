import string
import random
import jwt

from django.conf import settings

from rest_framework.request import Request
from rest_framework import status

from url.models import ShortenedUrl
from common.exceptions import GenericAPIException


def get_user_id_from_cookie(request: Request):
    access_token = request.COOKIES.get("access")
    if not access_token:
        response = {
            "detail": "login required",
        }
        raise GenericAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=response
        )
    key = settings.SIMPLE_JWT.get("SIGNING_KEY")
    algorithm = settings.SIMPLE_JWT.get("ALGORITHM")
    decoded_jwt = jwt.decode(access_token, key, algorithm)
    user_id = decoded_jwt.get("user_id")

    return user_id


def make_prefix():
    str_pool = string.ascii_letters
    return random.choice(str_pool)


def make_shortened_url():
    str_pool = string.digits + string.ascii_letters
    return "".join([random.choice(str_pool) for _ in range(6)])


def make_shortened_url_and_prefix():
    while True:
        prefix = make_prefix()
        shortened_url = make_shortened_url()
        if not ShortenedUrl.objects.filter(
            prefix=prefix, shortened_url=shortened_url
        ).exists():
            return prefix, shortened_url
        else:
            continue
