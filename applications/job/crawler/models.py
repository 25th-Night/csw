from django.db import models

from job.models import Category, Country, DetailRegion, Group, Region, Site, Skill
from common.models import CommonModel


class Crawling(CommonModel):
    user_id = models.IntegerField(verbose_name="이용자 ID")
    site = models.ForeignKey(
        Site,
        verbose_name="사이트",
        on_delete=models.CASCADE,
        null=True,
        related_name="crawling",
    )
    min_career = models.IntegerField(verbose_name="최소 경력년수", null=True)
    group = models.ForeignKey(
        Group,
        verbose_name="그룹",
        on_delete=models.CASCADE,
        null=True,
        related_name="crawling",
    )
    categories = models.ManyToManyField(
        Category,
        through="CrawlingCategory",
        verbose_name="카테고리",
        related_name="crawling",
    )
    country = models.ForeignKey(
        Country,
        verbose_name="국가",
        on_delete=models.CASCADE,
        null=True,
        related_name="crawling",
    )
    region = models.ForeignKey(
        Region,
        verbose_name="지역",
        on_delete=models.CASCADE,
        null=True,
        related_name="crawling",
    )
    detail_region = models.ForeignKey(
        DetailRegion,
        verbose_name="지역",
        on_delete=models.CASCADE,
        null=True,
        related_name="crawling",
    )
    skills = models.ManyToManyField(
        Skill, through="CrawlingSkill", verbose_name="스킬", related_name="crawling"
    )

    def __str__(self):
        return f"Crawling No.{self.id}"

    class Meta:
        indexes = [
            models.Index(fields=["-created_at"]),
        ]
        ordering = ["-created_at"]


class CrawlingCategory(models.Model):
    crawling = models.ForeignKey(Crawling, verbose_name="크롤링", on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, verbose_name="카테고리", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(verbose_name="생성일", auto_now_add=True)

    class Meta:
        db_table = "through_crawling_category"


class CrawlingSkill(models.Model):
    crawling = models.ForeignKey(Crawling, verbose_name="크롤링", on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, verbose_name="스킬", on_delete=models.CASCADE)
    created_at = models.DateTimeField(verbose_name="생성일", auto_now_add=True)

    class Meta:
        db_table = "through_crawling_skill"
