from django.contrib import admin

from job.models import (
    Category,
    Company,
    Country,
    DetailRegion,
    Group,
    Recruit,
    RecruitCategory,
    RecruitSkill,
    Region,
    Site,
    Skill,
)


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
    ]


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "index",
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "group",
    ]
    list_filter = ["group"]


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
    ]


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "country",
    ]
    list_filter = ["country"]


@admin.register(DetailRegion)
class DetailRegionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "region",
        "display_country",
    ]
    list_filter = ["region", "region__country"]
    search_fields = ["region__name", "region__country__name"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("region")

    @admin.display(description="국가")
    def display_country(self, obj):
        return obj.region.country


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "detail_region",
        "display_region",
        "display_tags",
    ]
    list_filter = ["detail_region", "detail_region__region__name"]
    search_fields = [
        "detail_region__name",
        "detail_region__region__name",
        "tags__name",
    ]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("detail_region")

    @admin.display(description="지역")
    def display_region(self, obj):
        return obj.detail_region.region

    @admin.display(description="태그")
    def display_tags(self, obj):
        return ", ".join(tag.name for tag in obj.tags.all())


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
    ]


@admin.register(Recruit)
class RecruitAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "site",
        "status",
        "url_id",
        "position",
        "min_career",
        "display_categories",
        "display_skills",
        "company",
        "display_tags",
        "detail_region",
        "display_region",
        "crawling",
    ]
    list_filter = ["detail_region__region__name"]
    search_fields = [
        "company__name",
        "detail_region__name",
        "detail_region__region__name",
        "company__tags__name",
        "skills__name",
    ]

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("site", "company", "detail_region")
            .prefetch_related("skills", "categories")
        )

    @admin.display(description="스킬")
    def display_skills(self, obj):
        return ", ".join(skill.name for skill in obj.skills.all())

    @admin.display(description="카테고리")
    def display_categories(self, obj):
        return ", ".join(category.name for category in obj.categories.all())

    @admin.display(description="지역")
    def display_region(self, obj):
        return obj.detail_region.region

    @admin.display(description="기업 태그")
    def display_tags(self, obj):
        return ", ".join(tag.name for tag in obj.company.tags.all())


@admin.register(RecruitCategory)
class RecruitCategoryAdmin(admin.ModelAdmin):
    list_display = [
        "recruit",
        "category",
    ]


@admin.register(RecruitSkill)
class RecruitSkillAdmin(admin.ModelAdmin):
    list_display = [
        "recruit",
        "skill",
    ]
