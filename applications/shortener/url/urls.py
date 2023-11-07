from django.urls import path

from url.views import ShortenedUrlDetailView, ShortenedUrlView, UrlRedirectView


urlpatterns = [
    path("shortener/<int:pk>", ShortenedUrlDetailView.as_view(), name="url_detail"),
    path("shortener/", ShortenedUrlView.as_view(), name="url_list"),
    path("<str:prefix>/<str:url>", UrlRedirectView.as_view(), name="redirect"),
]
