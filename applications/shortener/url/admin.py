from django.contrib import admin
from .models import ShortenedUrl


@admin.register(ShortenedUrl)
class ShortenedUrlAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "nick_name",
        "creator_id",
        "target_url",
        "prefix",
        "shortened_url",
        "last_clicked",
        "expired_at",
        "is_active",
    ]
    list_filter = ["created_at", "updated_at", "last_clicked"]
    search_fields = ["nick_name", "target_url"]
