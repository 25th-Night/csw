from jwt.exceptions import DecodeError, ExpiredSignatureError

from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BaseAuthentication

from common.utils import (
    get_token_from_request,
    get_user_info_via_authorization,
)


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        try:
            access_token = get_token_from_request(request)
            if access_token is None:
                return None
            user = get_user_info_via_authorization(request)
            return (user, None)
        except DecodeError:
            raise AuthenticationFailed(
                {
                    "success": False,
                    "detail": "잘못된 토큰입니다.",
                    "code": "JWT_403_INVALID_ACCESSTOKEN",
                }
            )
        except ExpiredSignatureError:
            raise AuthenticationFailed(
                {
                    "success": False,
                    "detail": "토큰이 만료되었습니다.",
                    "code": "JWT_403_EXPIRED_ACCESSTOKEN",
                }
            )
