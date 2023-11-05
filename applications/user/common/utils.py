from django.shortcuts import get_object_or_404
import jwt

from django.conf import settings

from rest_framework.request import Request
from rest_framework import status
from user.models import User

from common.exceptions import GenericAPIException


def get_user_id_from_token(request: Request):
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


def get_user_url_license(request: Request):
    user_id = get_user_id_from_token(request)
    user = get_object_or_404(User, id=user_id)
    url_license = user.url.license
    return url_license
