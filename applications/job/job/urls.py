from django.urls import path

from job.views import (
    CountryView,
    DetailRegionView,
    CategoryView,
    GroupView,
    RecruitDetailView,
    RegionView,
    RecruitView,
    SiteView,
)


urlpatterns = [
    path("sites", SiteView.as_view(), name="sites"),
    path("groups", GroupView.as_view(), name="groups"),
    path("categories", CategoryView.as_view(), name="category"),
    path("countries", CountryView.as_view(), name="country"),
    path("regions", RegionView.as_view(), name="regions"),
    path("detail_regions", DetailRegionView.as_view(), name="detail_region"),
    path("recruits", RecruitView.as_view(), name="recruits"),
    path("recruits/<int:pk>", RecruitDetailView.as_view(), name="recruit"),
]
