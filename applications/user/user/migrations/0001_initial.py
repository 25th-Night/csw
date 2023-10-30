# Generated by Django 4.2.6 on 2023-10-30 14:57

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                ("is_active", models.BooleanField(default=True, verbose_name="활성 여부")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="생성일"),
                ),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="갱신일")),
                (
                    "email",
                    models.EmailField(max_length=100, unique=True, verbose_name="이메일"),
                ),
                ("fullname", models.TextField(max_length=30, verbose_name="이름")),
                (
                    "phone",
                    models.TextField(max_length=30, unique=True, verbose_name="휴대폰번호"),
                ),
                ("password", models.CharField(max_length=100, verbose_name="비밀번호")),
                ("is_admin", models.BooleanField(default=False, verbose_name="관리자여부")),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "사용자",
                "verbose_name_plural": "사용자 목록",
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(
                        fields=["-created_at"], name="user_user_created_02326c_idx"
                    )
                ],
            },
        ),
    ]