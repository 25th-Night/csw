from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

from rest_framework import status
from rest_framework.response import Response

from common.utils import (
    check_access_token_valid,
    get_user_from_request,
    refresh_access_token_from_request,
)


class TokenRefreshMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access_token = request.COOKIES.get("access")

        if access_token:
            check_token = check_access_token_valid(request)
            if check_token == "Valid":
                response = self.get_response(request)
                return response
            elif check_token == "DecodeError":
                response_data = {
                    "detail": "Invalid Token",
                }
                response = Response(response_data, status=status.HTTP_401_UNAUTHORIZED)
                return response
            elif check_token == "ExpiredSignatureError":
                print("Refresh Token Now")
                response = self.get_response(request)
                access_token, refresh_token = refresh_access_token_from_request(request)

                response.set_cookie(
                    "access",
                    access_token,
                    domain=settings.DOMAIN,
                    secure=True,
                    httponly=True,
                )
                response.set_cookie(
                    "refresh",
                    refresh_token,
                    domain=settings.DOMAIN,
                    secure=True,
                    httponly=True,
                )

                return response
        else:
            response = self.get_response(request)
            return response


class AuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.user = None

        access_token = request.COOKIES.get("access")

        if access_token:
            check_token = check_access_token_valid(request)
            if check_token == "Valid":
                request.user = get_user_from_request(request)
