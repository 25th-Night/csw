from django.urls import path

from rendering.views.index import IndexView
from rendering.views.user import LoginView
from rendering.views.url import PrivateUrlView, SecretUrlView, UrlView


urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("login/", LoginView.as_view(), name="login"),
    path("url/", UrlView.as_view(), name="url"),
    path("url/private", PrivateUrlView.as_view(), name="url_private"),
    path("url/secret", SecretUrlView.as_view(), name="url_secret"),
]
