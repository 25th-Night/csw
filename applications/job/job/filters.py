from django_filters import rest_framework as filters
from django.db.models.query import QuerySet

from job.models import Category, DetailRegion, Recruit, Region


class CategoryFilter(filters.FilterSet):
    group_id = filters.NumberFilter(field_name="group", lookup_expr="exact")

    class Meta:
        model = Category
        fields = ["group_id"]


class RegionFilter(filters.FilterSet):
    country_id = filters.NumberFilter(field_name="country", lookup_expr="exact")

    class Meta:
        model = Region
        fields = ["country_id"]


class DetailRegionFilter(filters.FilterSet):
    region_id = filters.NumberFilter(field_name="region", lookup_expr="exact")

    class Meta:
        model = DetailRegion
        fields = ["region_id"]


class RecruitFilter(filters.FilterSet):
    site_id = filters.NumberFilter(field_name="site", lookup_expr="exact")
    detail_region_id = filters.NumberFilter(
        field_name="detail_region", lookup_expr="exact"
    )
    region_id = filters.NumberFilter(
        field_name="detail_region__region__id", lookup_expr="exact"
    )
    country_id = filters.NumberFilter(
        field_name="detail_region__region__country__id", lookup_expr="exact"
    )
    skills = filters.CharFilter(method="filter_by_skills")
    company_tags = filters.CharFilter(method="filter_by_company_tags")
    categories = filters.CharFilter(method="filter_by_categories")
    group_id = filters.CharFilter(method="filter_by_group_id")

    class Meta:
        model = Recruit
        fields = [
            "site_id",
            "detail_region_id",
            "region_id",
            "country_id",
            "skills",
            "company_tags",
            "categories",
            "group_id",
        ]

    def filter_by_skills(self, queryset, name, value):
        skills = value.split(",")
        result = queryset

        for skill in skills:
            result: QuerySet = result.filter(skills__name__iexact=skill)

        return result

    def filter_by_company_tags(self, queryset, name, value):
        company_tags = value.split(",")
        result = queryset

        for company_tag in company_tags:
            result: QuerySet = result.filter(company__tags__name__iexact=company_tag)

        return result

    def filter_by_categories(self, queryset, name, value):
        category_ids = [int(cat_id) for cat_id in value.split(",") if cat_id.isdigit()]
        return queryset.filter(categories__id__in=category_ids)

    def filter_by_group_id(self, queryset, name, value):
        return queryset.filter(categories__group__id=value)
