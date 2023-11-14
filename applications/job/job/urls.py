from django.urls import path

from job.views import (
    CountryView,
    DetailRegionView,
    CategoryView,
    GroupView,
    RegionView,
    RecruitView,
)


urlpatterns = [
    path("groups", GroupView.as_view(), name="groups"),
    path("categories", CategoryView.as_view(), name="category"),
    path("countries", CountryView.as_view(), name="country"),
    path("regions", RegionView.as_view(), name="regions"),
    path("detail_regions", DetailRegionView.as_view(), name="detail_region"),
    path("recruits", RecruitView.as_view(), name="recruits"),
]
