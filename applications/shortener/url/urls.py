from django.urls import path

from url.views import (
    ShortenedUrlDetailViaIdView,
    ShortenedUrlDetailViaUrlView,
    ShortenedUrlView,
    UrlRedirectView,
    RefreshAccessCodeView,
)


urlpatterns = [
    path(
        "shortener/<int:pk>/refresh",
        RefreshAccessCodeView.as_view(),
        name="access_code_refresh",
    ),
    path(
        "shortener/<int:pk>", ShortenedUrlDetailViaIdView.as_view(), name="url_detail"
    ),
    path(
        "shortener/<str:prefix>/<str:url>",
        ShortenedUrlDetailViaUrlView.as_view(),
        name="url_detail_via_url",
    ),
    path("shortener/", ShortenedUrlView.as_view(), name="url_list"),
    path("<str:prefix>/<str:url>", UrlRedirectView.as_view(), name="redirect"),
]
