from rest_framework.permissions import BasePermission
from rest_framework import status
from rest_framework.request import Request

from common.exceptions import GenericAPIException
from common.utils import get_token_from_request, get_user_id_from_request


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return bool(type(request.user) == dict and request.user.get("is_authenticated"))


class LoginRequired(BasePermission):
    SAFE_METHODS = ("GET",)
    message = "Not Allowed"

    @staticmethod
    def class_name(obj):
        return type(obj).__name__

    def has_permission(self, request: Request, view):
        access_token = get_token_from_request(request)
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
        user_id = get_user_id_from_request(request)
        if hasattr(obj, "creator_id"):
            return obj.creator_id == user_id
