from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from django.contrib.auth import authenticate

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

    def post(self, request):
        serializer: UserSerializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")
        # email = request.data.get("email")
        # password = request.data.get("password")
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
        response_data = {
            "detail": "logout success",
        }

        response = Response(response_data, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response
