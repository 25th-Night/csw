import string
import random
import jwt
from jwt.exceptions import DecodeError, ExpiredSignatureError

from django.conf import settings

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

import requests

from url.models import ShortenedUrl
from common.exceptions import GenericAPIException


def _get_queryset(klass):
    if hasattr(klass, "_default_manager"):
        return klass._default_manager.all()
    return klass


def get_object_or_404(klass, *args, **kwargs):
    queryset = _get_queryset(klass)
    if not hasattr(queryset, "get"):
        klass__name = (
            klass.__name__ if isinstance(klass, type) else klass.__class__.__name__
        )
        raise ValueError(
            "First argument to get_object_or_404() must be a Model, Manager, "
            "or QuerySet, not '%s'." % klass__name
        )
    try:
        return queryset.get(*args, **kwargs)
    except queryset.model.DoesNotExist:
        return Response(
            {"detail": "Object not found"}, status=status.HTTP_404_NOT_FOUND
        )


def check_access_token_valid(request):
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
    try:
        decoded_jwt = jwt.decode(access_token, key, algorithm)
        return "Valid"
    except DecodeError:
        return "DecodeError"
    except ExpiredSignatureError:
        return "ExpiredSignatureError"


def get_token_from_request(request: Request):
    access_token = None
    print(f"request.__dict__:{request.__dict__}")
    print(request.headers)
    print(request.COOKIES)
    print(request.COOKIES.get("access"))
    cookie = request.headers.get("Cookie", None)
    print(cookie)
    if cookie:
        for content in cookie.split("; "):
            if content.startswith("access"):
                access_token = content[7:]
                break
    return access_token


def get_refresh_token_from_request(request: Request):
    refresh_token = None
    cookie = request.headers.get("Cookie", None)
    if cookie:
        for content in cookie.split("; "):
            if content.startswith("refresh"):
                refresh_token = content[8:]
                break
    return refresh_token


def get_user_id_from_request(request: Request):
    access_token = get_token_from_request(request)
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


def get_user_info_via_authorization(request: Request):
    access_token = get_token_from_request(request)
    auth_url = f"{settings.USER_DOMAIN}/api/user/auth"
    print(f"auth_url: {auth_url}")
    cookies = {"access": access_token}
    print(f"cookies: {cookies}")

    response = requests.get(auth_url, cookies=cookies)
    print(f"response.json():{response.json()}")

    if response.status_code == 200:
        user = response.json()
        return user
    else:
        return {"detail": "User not found"}


def refresh_access_token(request: Request):
    refresh_token = get_refresh_token_from_request(request)
    cookies = {"refresh": refresh_token}
    refresh_url = f"{settings.USER_DOMAIN}/api/user/refresh"
    response = requests.post(refresh_url)

    if response.status_code == 200:
        token = response.json().get("token")
        access_token = token.get("access_token")
        refresh_token = token.get("refresh_token")
        return access_token, refresh_token


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
