from django.contrib import admin
from .models import Url, User


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
