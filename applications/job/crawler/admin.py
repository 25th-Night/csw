from django.contrib import admin

from crawler.models import Crawling, CrawlingCategory, CrawlingSkill


@admin.register(Crawling)
class CrawlingAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user_id",
        "site",
        "min_career",
        "group",
        "country",
        "region",
        "detail_region",
        "display_categories",
        "display_skills",
    ]
    list_filter = ["created_at", "categories__name", "skills__name"]
    search_fields = [
        "site",
        "user_id",
        "min_career",
        "group",
        "category",
        "country",
        "region",
        "detail_region",
        "categories__name",
        "skills__name",
    ]

    @admin.display(description="스킬")
    def display_skills(self, obj):
        return ", ".join(skill.name for skill in obj.skills.all())

    @admin.display(description="카테고리")
    def display_categories(self, obj):
        return ", ".join(category.name for category in obj.categories.all())


@admin.register(CrawlingCategory)
class CrawlingCategoryAdmin(admin.ModelAdmin):
    list_display = [
        "crawling",
        "category",
    ]


@admin.register(CrawlingSkill)
class CrawlingSkillAdmin(admin.ModelAdmin):
    list_display = [
        "crawling",
        "skill",
    ]
