# Generated by Django 4.2.6 on 2023-11-04 10:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0002_alter_user_fullname_alter_user_phone"),
    ]

    operations = [
        migrations.CreateModel(
            name="Url",
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
                ("is_active", models.BooleanField(default=True, verbose_name="활성 여부")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="생성일"),
                ),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="갱신일")),
                (
                    "license",
                    models.IntegerField(
                        choices=[
                            (1, "Free"),
                            (2, "Basic"),
                            (3, "Premium"),
                            (4, "Master"),
                        ],
                        default=1,
                        verbose_name="라이선스",
                    ),
                ),
                (
                    "total_cnt",
                    models.IntegerField(default=0, verbose_name="사용 중인 총 URL 수"),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="url",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="사용자",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
