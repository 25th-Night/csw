from django.urls import path

from url.views import ShortenedUrlView, UrlRedirectView


urlpatterns = [
    path("shortener/", ShortenedUrlView.as_view(), name="shortener"),
    path("<str:prefix>/<str:url>", UrlRedirectView.as_view(), name="redirect"),
]
