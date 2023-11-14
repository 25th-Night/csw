from django.db import models
from common.models import CommonModel
from taggit.managers import TaggableManager


class Site(CommonModel):
    name = models.CharField(verbose_name="사이트명", max_length=20, unique=True)


class Group(CommonModel):
    name = models.CharField(verbose_name="그룹명", max_length=20, unique=True)
    index = models.IntegerField(verbose_name="인덱스")

    def __str__(self):
        return self.name


class Category(CommonModel):
    name = models.CharField(verbose_name="카테고리명", max_length=20, unique=True)
    group = models.ForeignKey(
        Group, verbose_name="그룹", on_delete=models.CASCADE, related_name="categories"
    )

    def __str__(self):
        return self.name


class Country(CommonModel):
    name = models.CharField(verbose_name="국가명", max_length=20, unique=True)

    def __str__(self):
        return self.name


class Region(CommonModel):
    name = models.CharField(verbose_name="지역명", max_length=50, unique=True)
    country = models.ForeignKey(
        Country, verbose_name="국가", on_delete=models.CASCADE, related_name="regions"
    )

    def __str__(self):
        return self.name


class DetailRegion(CommonModel):
    name = models.CharField(verbose_name="세부지역명", max_length=50)
    region = models.ForeignKey(
        Region,
        verbose_name="지역",
        on_delete=models.CASCADE,
        related_name="detail_regions",
    )

    def __str__(self):
        return self.name


class Company(CommonModel):
    name = models.CharField(verbose_name="기업명", max_length=50)
    detail_region = models.ForeignKey(
        DetailRegion,
        verbose_name="세부지역",
        on_delete=models.CASCADE,
        related_name="companies",
    )
    tags = TaggableManager()

    def __str__(self):
        return self.name


class Skill(CommonModel):
    name = models.CharField(verbose_name="스킬", max_length=30)

    def __str__(self):
        return self.name


class Recruit(CommonModel):
    min_career = models.IntegerField(verbose_name="최소 경력년수", default=0)
    url_id = models.IntegerField(verbose_name="URL ID")
    position = models.CharField(verbose_name="포지션", max_length=50)
    description = models.TextField(verbose_name="세부사항")
    task = models.TextField(verbose_name="주요업무")
    requirement = models.TextField(verbose_name="자격요건")
    preference = models.TextField(verbose_name="우대사항")
    benefit = models.TextField(verbose_name="혜택 및 복지")
    workplace = models.CharField(verbose_name="근무지역", max_length=100)
    status = models.BooleanField(verbose_name="공고등록 상태")
    site = models.ForeignKey(
        Site, verbose_name="사이트", on_delete=models.CASCADE, related_name="recruits"
    )
    detail_region = models.ForeignKey(
        DetailRegion,
        verbose_name="세부지역",
        on_delete=models.CASCADE,
        related_name="recruits",
    )
    company = models.ForeignKey(
        Company,
        verbose_name="기업",
        on_delete=models.CASCADE,
        related_name="recruits",
    )
    categories = models.ManyToManyField(
        Category, verbose_name="카테고리", related_name="recruits"
    )
    skills = models.ManyToManyField(Skill, verbose_name="스킬", related_name="recruits")

    def __str__(self):
        return f"{self.company}의 채용공고: No. {self.url}"

    class Meta:
        indexes = [
            models.Index(fields=["-created_at"]),
        ]
        ordering = ["-created_at"]
