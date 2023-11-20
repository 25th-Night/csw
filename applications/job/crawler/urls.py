from django.urls import path

from crawler.views import (
    RecruitDetailView,
    RecruitView,
    SkillSearchView,
)


urlpatterns = [
    path("recruits", RecruitView.as_view(), name="crawling_recruits"),
    path("recruits/<int:url>", RecruitDetailView.as_view(), name="crawling_recruit"),
    path("skill/search", SkillSearchView.as_view(), name="search_skill"),
]
