from django.contrib import admin

from job.models import (
    Category,
    Company,
    Country,
    DetailRegion,
    Group,
    Recruit,
    RecruitCategory,
    JobSetting,
    RecruitSkill,
    Region,
    Site,
    Skill,
)

from common.data import MIN_CAREER_TYPE


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


@admin.register(JobSetting)
class JobSettingAdmin(admin.ModelAdmin):
    list_display = [
        "user_id",
        "type",
        "site",
        "get_min_career",
        "group",
        "country",
        "region",
        "detail_region",
        "categories",
        "skills",
        "created_at",
        "updated_at",
    ]

    @admin.display(description="사이트명")
    def site(self, obj):
        return obj.get_type_display()

    @admin.display(description="유형")
    def site(self, obj):
        site_name = Site.objects.get(id=obj.site_id).name if obj.site_id else "전체"
        return site_name

    @admin.display(description="최소 경력년수")
    def get_min_career(self, obj):
        if obj.min_career > 0:
            min_career = MIN_CAREER_TYPE[obj.min_career][1]
        elif obj.min_career == 0:
            min_career = None
        elif obj.min_career == -1:
            min_career = "newcomer"
        return min_career

    @admin.display(description="그룹명")
    def group(self, obj):
        group_name = Group.objects.get(id=obj.group_id).name if obj.group_id else "전체"
        return group_name

    @admin.display(description="국가명")
    def country(self, obj):
        country_name = (
            Country.objects.get(id=obj.country_id).name if obj.country_id else "전체"
        )
        return country_name

    @admin.display(description="지역명")
    def region(self, obj):
        region_name = (
            Region.objects.get(id=obj.region_id).name if obj.region_id else "전체"
        )
        return region_name

    @admin.display(description="세부 지역명")
    def detail_region(self, obj):
        detail_region_name = (
            DetailRegion.objects.get(id=obj.detail_region_id).name
            if obj.detail_region_id
            else "전체"
        )
        return detail_region_name

    @admin.display(description="카테고리 목록")
    def categories(self, obj):
        category_ids = list(map(int, obj.category_ids.split(",")))
        category_list = [
            Category.objects.get(id=category_id).name for category_id in category_ids
        ]
        return ", ".join(category_list)

    @admin.display(description="스킬 목록")
    def skills(self, obj):
        skill_ids = list(map(int, obj.skill_ids.split(",")))
        skill_list = [Skill.objects.get(id=skill_id).name for skill_id in skill_ids]
        return ", ".join(skill_list)
