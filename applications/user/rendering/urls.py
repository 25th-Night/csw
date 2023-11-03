from django.urls import path

from rendering.views import IndexView


urlpatterns = [
    path("", IndexView.as_view(), name="index"),
]
