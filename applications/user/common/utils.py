import jwt
from jwt.exceptions import DecodeError, ExpiredSignatureError

from django.conf import settings


from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from user.models import User

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


def get_token_from_request(request: Request):
    access_token = None
    try:
        for content in request.headers.get("Cookie").split("; "):
            if content.startswith("access"):
                access_token = content[7:]
                break
        return access_token
    except:
        return None


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


def get_user_id_from_request(request: Request):
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


def get_user_from_request(request: Request):
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
    user = get_object_or_404(User, id=user_id)

    return user


def get_user_id_from_access_token(access_token):
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


def get_user_from_access_token(access_token):
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
    user = get_object_or_404(User, id=user_id)

    return user


def get_user_url_license(request: Request):
    user_id = get_user_id_from_request(request)
    user = get_object_or_404(User, id=user_id)
    url_license = user.url.license
    return url_license


def refresh_access_token_from_request(request: Request):
    refresh_token = request.COOKIES.get("refresh", None)

    if not refresh_token:
        return Response(
            {"error": "Refresh Token required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return access_token, refresh_token

    except Exception as e:
        return Response(
            {"error": "refresh token failed"}, status=status.HTTP_400_BAD_REQUEST
        )
