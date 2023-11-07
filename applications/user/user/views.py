import re

from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from django.contrib.auth import authenticate, logout
from django.contrib.auth.hashers import check_password


from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from common.utils import (
    get_object_or_404,
    get_user_from_request,
    get_user_id_from_access_token,
    refresh_access_token_from_request,
)

from user.models import Url, User
from user.serializers import SignUpSerializer, UserSerializer


class SignUpView(GenericAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]

    def post(self, request: Request):
        serializer: SignUpSerializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token = TokenObtainPairSerializer.get_token(user)
        access_token = str(token.access_token)
        refresh_token = str(token)

        response_data = {
            "user": serializer.data,
            "detail": "register success",
            "token": {
                "access": access_token,
                "refresh": refresh_token,
            },
        }

        response = Response(response_data, status=status.HTTP_200_OK)
        response.set_cookie("access", access_token, httponly=True)
        response.set_cookie("refresh", refresh_token, httponly=True)

        return response


class AuthView(GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            user: User = get_user_from_request(request)
            serializer: UserSerializer = self.get_serializer(user)

            serializer_data = serializer.data
            serializer_data["is_authenticated"] = True
            serializer_data["url_license"] = user.url.license
            return Response(serializer_data, status=status.HTTP_200_OK)
        except ExpiredSignatureError:
            data = {"refresh": request.COOKIES.get("refresh", None)}
            serializer = TokenRefreshSerializer(data=data)

            serializer.is_valid(raise_exception=True)
            access_token = serializer.data.get("access", None)
            refresh_token = serializer.data.get("refresh", None)

            user = get_user_id_from_access_token(access_token)
            serializer: UserSerializer = self.get_serializer(user)

            response: Response = Response(serializer.data, status=status.HTTP_200_OK)
            response.set_cookie("access", access_token, httponly=True)
            response.set_cookie("refresh", refresh_token, httponly=True)

            return response
        except InvalidTokenError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer: UserSerializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")
        user = authenticate(email=email, password=password)

        if user is not None:
            serializer: UserSerializer = self.get_serializer(user)
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)

            response_data = {
                "user": serializer.data,
                "detail": "login success",
                "token": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            }

            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie("access", access_token, httponly=True)
            response.set_cookie("refresh", refresh_token, httponly=True)

            return response

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if hasattr(request.user, "is_authenticated") and request.user.is_authenticated:
            logout(request)
        response_data = {
            "detail": "logout success",
        }

        response = Response(response_data, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token, refresh_token = refresh_access_token_from_request(request)

        response_data = {
            "detail": "refresh token success",
            "token": {
                "access": access_token,
                "refresh": refresh_token,
            },
        }

        response = Response(response_data, status=status.HTTP_200_OK)
        response.set_cookie("access", access_token, httponly=True)
        response.set_cookie("refresh", refresh_token, httponly=True)

        return response


class EmailExistView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        email = request.data.get("email")

        user_exist = User.objects.filter(email=email).exists()

        response_data = {"user_exist": user_exist}

        response = Response(response_data, status=status.HTTP_200_OK)

        return response


class PhoneCheckView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        phone = request.data.get("phone")

        user_exist = User.objects.filter(phone=phone).exists()

        match = "^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$"
        validation = re.compile(match)

        phone_format = False if validation.match(phone) is None else True
        response_data = {"user_exist": user_exist, "phone_format": phone_format}

        response = Response(response_data, status=status.HTTP_200_OK)

        return response


class PasswordCorrectView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = get_object_or_404(User, email=email)

        password_check = check_password(password, user.password)

        response_data = {"password_check": password_check}

        response = Response(response_data, status=status.HTTP_200_OK)

        return response


class PasswordFormatView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        password = request.data.get("password")

        match = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
        message = "비밀번호는 하나 이상의 문자, 숫자, 특수문자를 포함하여 8자리 이상으로 작성해주세요."
        validation = re.compile(match)

        password_format = True if validation.match(password) is not None else False
        response_data = {"password_format": password_format}

        response = Response(response_data, status=status.HTTP_200_OK)

        return response


class UpdateTotalUrlCountView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        user = request.user

        url = get_object_or_404(Url, user=user)
        update = request.data.get("update")

        response_data = {"detail": "update success"}
        status = status.HTTP_200_OK

        if update == "created":
            url.total_cnt += 1
        elif update == "deleted":
            url.total_cnt -= 1
        else:
            response_data = {"detail": "Bad request"}
            status = status.HTTP_400_BAD_REQUEST

        response = Response(response_data, status=status.HTTP_200_OK)

        return response
