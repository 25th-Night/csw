from django.shortcuts import get_object_or_404, redirect
import jwt

from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from common.permissions import LoginRequired
from common.utils import get_user_id_from_cookie
from url.models import ShortenedUrl
from url.serializers import ShortenedUrlSerializer


class ShortenedUrlView(GenericAPIView):
    permission_classes = [LoginRequired]
    serializer_class = ShortenedUrlSerializer

    def get(self, request: Request):
        user_id = get_user_id_from_cookie(request)
        shortened_url = ShortenedUrl.objects.filter(creator_id=user_id, is_active=True)

        serializer: ShortenedUrlSerializer = self.get_serializer(
            shortened_url, many=True
        )

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request):
        serializer: ShortenedUrlSerializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        shortened_url = serializer.save()
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class UrlRedirectView(GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, prefix, url):
        shortened_url = get_object_or_404(
            ShortenedUrl, prefix=prefix, shortened_url=url
        )

        target_url = shortened_url.target_url

        if not target_url.startswith("https://") and not target_url.startswith(
            "http://"
        ):
            target_url = "https://" + target_url

        return redirect(target_url)
