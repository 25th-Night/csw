from django_filters import rest_framework as filters
from django.db.models.query import QuerySet

from job.models import Category, DetailRegion, Recruit, Region, Skill


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
    country_id = filters.NumberFilter(
        field_name="region__country__id", lookup_expr="exact"
    )

    class Meta:
        model = DetailRegion
        fields = ["region_id"]


class SkillFilter(filters.FilterSet):
    skill_ids = filters.CharFilter(method="filter_by_skill_ids")
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = Skill
        fields = [
            "skill_ids",
            "name",
        ]

    def filter_by_skill_ids(self, queryset, name, value):
        skill_list = list(map(int, value.split(",")))
        print(f"skill_list:{skill_list}")
        result = queryset

        result: QuerySet = result.filter(id__in=skill_list)
        print(f"result:{result}")

        return result


class RecruitFilter(filters.FilterSet):
    site_id = filters.NumberFilter(field_name="site", lookup_expr="exact")
    country_id = filters.NumberFilter(
        field_name="detail_region__region__country__id", lookup_expr="exact"
    )
    region_id = filters.NumberFilter(
        field_name="detail_region__region__id", lookup_expr="exact"
    )
    detail_region_id = filters.NumberFilter(
        field_name="detail_region", lookup_expr="exact"
    )
    skill_ids = filters.CharFilter(method="filter_by_skill_ids")
    company_tag_ids = filters.CharFilter(method="filter_by_company_tag_ids")
    category_ids = filters.CharFilter(method="filter_by_category_ids")
    group_id = filters.CharFilter(method="filter_by_group_id")
    min_career = filters.NumberFilter(method="filter_by_min_career")
    # min_career = filters.CharFilter(method="filter_by_min_career")

    class Meta:
        model = Recruit
        fields = [
            "site_id",
            "country_id",
            "region_id",
            "detail_region_id",
            "skill_ids",
            "company_tag_ids",
            "category_ids",
            "group_id",
            "min_career",
        ]

    def filter_by_skill_ids(self, queryset, name, value):
        skills = value.split(",")
        result = queryset

        for skill in skills:
            result: QuerySet = result.filter(skills__id__iexact=skill)

        return result

    def filter_by_company_tag_ids(self, queryset, name, value):
        company_tag_ids = [
            int(company_tag_id)
            for company_tag_id in value.split(",")
            if company_tag_id.isdigit()
        ]
        print(f"company_tag_ids:{company_tag_ids}")
        result = queryset

        for company_tag_id in company_tag_ids:
            result: QuerySet = result.filter(
                company__tags__id__iexact=company_tag_id
            ).distinct()

        return result

    def filter_by_category_ids(self, queryset, name, value):
        category_ids = [
            int(category_id)
            for category_id in value.split(",")
            if category_id.isdigit()
        ]
        return queryset.filter(categories__id__in=category_ids)

    def filter_by_group_id(self, queryset, name, value):
        return queryset.filter(categories__group__id=value).distinct()

    def filter_by_min_career(self, queryset, name, value):
        if value == -1:
            result = queryset.filter(min_career=0)
        else:
            result = queryset.filter(min_career=value)
        return result

    # def filter_by_min_career(self, queryset, name, value):
    #     result = queryset

    #     return queryset.filter(min_career__gte=int(value))
