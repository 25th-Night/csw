from django.urls import path

from crawler.views import (
    RecruitDetailView,
    RecruitView,
)


urlpatterns = [
    path("recruits/", RecruitView.as_view(), name="recruits"),
    path("recruits/<int:url>", RecruitDetailView.as_view(), name="recruit"),
]
