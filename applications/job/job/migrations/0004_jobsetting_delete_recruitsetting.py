# Generated by Django 4.2.7 on 2023-11-18 02:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("job", "0003_recruitsetting_alter_recruit_min_career"),
    ]

    operations = [
        migrations.CreateModel(
            name="JobSetting",
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
                    "type",
                    models.IntegerField(
                        choices=[(1, "Recruit"), (2, "Crawling")], verbose_name="설정 종류"
                    ),
                ),
                ("user_id", models.IntegerField(verbose_name="이용자 ID")),
                ("site_id", models.IntegerField(default=0, verbose_name="사이트 ID")),
                (
                    "min_career",
                    models.IntegerField(
                        choices=[
                            (0, "newcomer"),
                            (1, "1 year ↑"),
                            (2, "2 year ↑"),
                            (3, "3 year ↑"),
                            (4, "4 year ↑"),
                            (5, "5 year ↑"),
                            (6, "6 year ↑"),
                            (7, "7 year ↑"),
                            (8, "8 year ↑"),
                            (9, "9 year ↑"),
                            (10, "10 year ↑"),
                        ],
                        default=0,
                        verbose_name="최소 경력년수",
                    ),
                ),
                ("group_id", models.IntegerField(default=0, verbose_name="그룹 ID")),
                ("country_id", models.IntegerField(default=0, verbose_name="국가 ID")),
                ("region_id", models.IntegerField(default=0, verbose_name="지역 ID")),
                (
                    "detail_region_id",
                    models.IntegerField(default=0, verbose_name="세부 지역 ID"),
                ),
                (
                    "category_ids",
                    models.CharField(
                        default="0", max_length=50, verbose_name="카테고리 ID 목록"
                    ),
                ),
                (
                    "skill_ids",
                    models.CharField(
                        default="0", max_length=50, verbose_name="스킬 ID 목록"
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.DeleteModel(
            name="RecruitSetting",
        ),
    ]