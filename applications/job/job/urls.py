from django.urls import path

from job.views import (
    CountryView,
    DetailRegionView,
    CategoryView,
    GroupView,
    RecruitDetailView,
    JobSettingView,
    RegionView,
    RecruitView,
    SiteView,
    SkillView,
    CompanyTagView,
)


urlpatterns = [
    path("sites", SiteView.as_view(), name="sites"),
    path("skills", SkillView.as_view(), name="skills"),
    path("company_tags", CompanyTagView.as_view(), name="company_tags"),
    path("groups", GroupView.as_view(), name="groups"),
    path("categories", CategoryView.as_view(), name="category"),
    path("countries", CountryView.as_view(), name="country"),
    path("regions", RegionView.as_view(), name="regions"),
    path("detail_regions", DetailRegionView.as_view(), name="detail_region"),
    path("recruits/<int:pk>", RecruitDetailView.as_view(), name="recruit"),
    path("recruits", RecruitView.as_view(), name="recruits"),
    path("settings/<int:type>", JobSettingView.as_view(), name="settings"),
]
