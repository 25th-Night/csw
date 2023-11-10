from django.shortcuts import redirect
import jwt

from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from common.data import LICENSE

from common.permissions import IsAuthenticated
from common.utils import get_object_or_404, make_access_code
from url.models import ShortenedUrl
from url.serializers import ShortenedUrlSerializer, SimpleShortenedUrlSerializer


class ShortenedUrlView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortenedUrlSerializer

    def get(self, request: Request):
        user_id = request.user.get("id")
        shortened_url = ShortenedUrl.objects.filter(creator_id=user_id, is_active=True)

        page = self.paginate_queryset(shortened_url)
        if page is not None:
            serializer: ShortenedUrlSerializer = self.get_serializer(page, many=True)
            response_data = self.get_paginated_response(serializer.data)
            response_data.data["page_size"] = self.pagination_class.page_size
            return response_data

        serializer: ShortenedUrlSerializer = self.get_serializer(
            shortened_url, many=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request):
        user_id = request.user.get("id")
        user_license = request.user.get("url_license")
        available_url_cnt = LICENSE.get(user_license).get("max_link_cnt")
        current_url_cnt = ShortenedUrl.objects.filter(
            creator_id=user_id, is_active=True
        ).count()

        if current_url_cnt >= available_url_cnt:
            response_data = {"detail": "Cannot create more URLs."}
            response = Response(response_data, status=status.HTTP_403_FORBIDDEN)
            return response

        request.data["creator_id"] = user_id
        if not request.data.get("expired_at"):
            request.data["expired_at"] = None
        serializer: ShortenedUrlSerializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        shortened_url = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UrlRedirectView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, prefix, url):
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl, prefix=prefix, shortened_url=url, is_active=True
        )

        if shortened_url.access == ShortenedUrl.Access.PUBLIC:
            print("Public")
            target_url = shortened_url.target_url

            if not target_url.startswith("https://") and not target_url.startswith(
                "http://"
            ):
                target_url = "https://" + target_url

            shortened_url.clicked()

            return redirect(target_url)

        elif shortened_url.access == ShortenedUrl.Access.PRIVATE:
            print("Private")
            shortened_url.clicked()
            return redirect(
                f"{settings.USER_DOMAIN}/url/private?prefix={prefix}&url={url}"
            )
        elif shortened_url.access == ShortenedUrl.Access.SECRET:
            print("Secret")
            shortened_url.clicked()
            return redirect(
                f"{settings.USER_DOMAIN}/url/secret?prefix={prefix}&url={url}"
            )

    def post(self, request: Request, prefix, url):
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl,
            prefix=prefix,
            shortened_url=url,
            access=ShortenedUrl.Access.PRIVATE,
            is_active=True,
        )

        access_code = request.data.get("access_code")

        if shortened_url.access_code == access_code:
            target_url = shortened_url.target_url

            if not target_url.startswith("https://") and not target_url.startswith(
                "http://"
            ):
                target_url = "https://" + target_url

            shortened_url.clicked()

            response_data = {"target_url": shortened_url.target_url}
            response = Response(response_data, status=status.HTTP_200_OK)
            return response
        else:
            response_data = {"detail": "Access code not matched"}
            response = Response(response_data, status=status.HTTP_401_UNAUTHORIZED)
            return response


class ShortenedUrlDetailViaIdView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortenedUrlSerializer

    def get(self, request, pk):
        user_id = request.user.get("id")
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl, creator_id=user_id, id=pk, is_active=True
        )

        serializer: ShortenedUrlSerializer = self.get_serializer(shortened_url)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        user_id = request.user.get("id")
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl, creator_id=user_id, id=pk, is_active=True
        )
        request.data["creator_id"] = user_id
        serializer: ShortenedUrlSerializer = self.get_serializer(
            shortened_url, data=request.data
        )
        serializer.is_valid(raise_exception=True)
        shortened_url = serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        user_id = request.user.get("id")
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl, creator_id=user_id, id=pk, is_active=True
        )

        access = int(request.data.get("access"))
        if access in range(1, 4):
            shortened_url.access = access
            shortened_url.save()

            return Response(status=status.HTTP_200_OK)
        else:
            response_data = {
                "detail": "not valid active status",
            }

            response = Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            return response

    def delete(self, request, pk):
        user_id = request.user.get("id")
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl, creator_id=user_id, id=pk, is_active=True
        )
        shortened_url.is_active = False
        shortened_url.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ShortenedUrlDetailViaUrlView(GenericAPIView):
    serializer_class = SimpleShortenedUrlSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        else:
            return [IsAuthenticated()]

    def get(self, request, prefix, url):
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl,
            prefix=prefix,
            shortened_url=url,
            is_active=True,
        )

        serializer: SimpleShortenedUrlSerializer = self.get_serializer(shortened_url)
        serialized_url_data = serializer.data
        if shortened_url.access == 1:
            shortened_url.clicked()
        elif shortened_url.access != 1:
            serialized_url_data.pop("target_url")
        print(f"serialized_url_data:{serialized_url_data}")

        return Response(serialized_url_data, status=status.HTTP_200_OK)

    def patch(self, request, prefix, url):
        user_id = request.user.get("id")
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl,
            creator_id=user_id,
            prefix=prefix,
            shortened_url=url,
            is_active=True,
        )

        shortened_url.access_code = make_access_code()
        shortened_url.save()

        serializer: ShortenedUrlSerializer = self.get_serializer(shortened_url)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RefreshAccessCodeView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortenedUrlSerializer

    def patch(self, request, pk):
        user_id = request.user.get("id")
        shortened_url: ShortenedUrl = get_object_or_404(
            ShortenedUrl, creator_id=user_id, id=pk, is_active=True
        )

        shortened_url.access_code = make_access_code()
        shortened_url.save()

        serializer: ShortenedUrlSerializer = self.get_serializer(shortened_url)

        return Response(serializer.data, status=status.HTTP_200_OK)
