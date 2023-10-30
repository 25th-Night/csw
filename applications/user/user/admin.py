from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "fullname", "phone", "is_admin"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["email", "fullname", "phone"]
