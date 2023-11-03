from django.urls import path

from rendering.views.index import IndexView
from rendering.views.user import LoginView


urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("login/", LoginView.as_view(), name="login"),
]
