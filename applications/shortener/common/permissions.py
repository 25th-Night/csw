from rest_framework.permissions import BasePermission
from rest_framework import status

from common.exceptions import GenericAPIException
from common.utils import get_user_id_from_cookie


class LoginRequired(BasePermission):
    SAFE_METHODS = ("GET",)
    message = "Not Allowed"

    @staticmethod
    def class_name(obj):
        return type(obj).__name__

    def has_permission(self, request, view):
        access_token = request.COOKIES.get("access")
        if not access_token:
            response = {
                "detail": "login required",
            }
            raise GenericAPIException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail=response
            )
        else:
            return True

    def has_object_permission(self, request, view, obj):
        user_id = get_user_id_from_cookie(request)
        if hasattr(obj, "creator_id"):
            return obj.creator_id == user_id
