from django.contrib import admin

from user.models import Job, Url, User
from common.data import JOB_LICENSE


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "fullname", "phone", "is_admin"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["email", "fullname", "phone"]


@admin.register(Url)
class UrlAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "get_license", "total_cnt"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["user", "license"]

    @admin.display(description="라이선스")
    def get_license(self, obj):
        return obj.get_license_display()


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "get_license", "daily_crawling_limit"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["user", "license"]

    @admin.display(description="라이선스")
    def get_license(self, obj):
        return obj.get_license_display()

    @admin.display(description="일일 허용 크롤링 횟수")
    def daily_crawling_limit(self, obj):
        return JOB_LICENSE.get(obj.license).get("daily_crawling_limit")
