from django.conf import settings
from rest_framework import status
from rest_framework.response import Response

from common.utils import check_access_token_valid, refresh_access_token


class TokenRefreshMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
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
            access_token, refresh_token = refresh_access_token(request)

            response.set_cookie(
                "access",
                access_token,
                domain=settings.DOMAIN,
                secure=settings.SECURE,
                httponly=True,
            )
            response.set_cookie(
                "refresh",
                refresh_token,
                domain=settings.DOMAIN,
                secure=settings.SECURE,
                httponly=True,
            )

            return response
