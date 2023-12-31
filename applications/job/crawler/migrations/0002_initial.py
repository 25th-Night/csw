# Generated by Django 4.2.7 on 2023-11-15 02:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("crawler", "0001_initial"),
        ("job", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="crawlingskill",
            name="skill",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="job.skill",
                verbose_name="스킬",
            ),
        ),
        migrations.AddField(
            model_name="crawlingcategory",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="job.category",
                verbose_name="카테고리",
            ),
        ),
        migrations.AddField(
            model_name="crawlingcategory",
            name="crawling",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="crawler.crawling",
                verbose_name="크롤링",
            ),
        ),
        migrations.AddField(
            model_name="crawling",
            name="categories",
            field=models.ManyToManyField(
                related_name="crawling",
                through="crawler.CrawlingCategory",
                to="job.category",
                verbose_name="카테고리",
            ),
        ),
        migrations.AddField(
            model_name="crawling",
            name="country",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="crawling",
                to="job.country",
                verbose_name="국가",
            ),
        ),
        migrations.AddField(
            model_name="crawling",
            name="detail_region",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="crawling",
                to="job.detailregion",
                verbose_name="지역",
            ),
        ),
        migrations.AddField(
            model_name="crawling",
            name="group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="crawling",
                to="job.group",
                verbose_name="그룹",
            ),
        ),
        migrations.AddField(
            model_name="crawling",
            name="region",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="crawling",
                to="job.region",
                verbose_name="지역",
            ),
        ),
        migrations.AddField(
            model_name="crawling",
            name="site",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="crawling",
                to="job.site",
                verbose_name="사이트",
            ),
        ),
        migrations.AddField(
            model_name="crawling",
            name="skills",
            field=models.ManyToManyField(
                related_name="crawling",
                through="crawler.CrawlingSkill",
                to="job.skill",
                verbose_name="스킬",
            ),
        ),
        migrations.AddIndex(
            model_name="crawling",
            index=models.Index(
                fields=["-created_at"], name="crawler_cra_created_42c8d1_idx"
            ),
        ),
    ]
