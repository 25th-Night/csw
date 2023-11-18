from django.db import models

from taggit.managers import TaggableManager

from common.models import CommonModel

from common.data import MIN_CAREER_TYPE


class Site(CommonModel):
    name = models.CharField(verbose_name="사이트명", max_length=20, unique=True)

    def __str__(self):
        return self.name


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
    min_career = models.IntegerField(
        verbose_name="최소 경력년수", choices=MIN_CAREER_TYPE, default=0
    )
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
        Category,
        through="RecruitCategory",
        verbose_name="카테고리",
        related_name="recruits",
    )
    skills = models.ManyToManyField(
        Skill, through="RecruitSkill", verbose_name="스킬", related_name="recruits"
    )
    crawling = models.ForeignKey(
        "crawler.Crawling", verbose_name="크롤링 정보", on_delete=models.CASCADE, null=True
    )

    def __str__(self):
        return f"{self.company}의 채용공고: No. {self.url_id}"


class RecruitCategory(models.Model):
    recruit = models.ForeignKey(Recruit, verbose_name="채용공고", on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, verbose_name="카테고리", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(verbose_name="생성일", auto_now_add=True)

    class Meta:
        db_table = "through_recruit_category"


class RecruitSkill(models.Model):
    recruit = models.ForeignKey(Recruit, verbose_name="채용공고", on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, verbose_name="스킬", on_delete=models.CASCADE)
    created_at = models.DateTimeField(verbose_name="생성일", auto_now_add=True)

    class Meta:
        db_table = "through_recruit_skill"


class JobSetting(CommonModel):
    class TypeChoices(models.IntegerChoices):
        RECRUIT = 1
        CRAWLING = 2

    type = models.IntegerField(verbose_name="설정 종류", choices=TypeChoices.choices)
    user_id = models.IntegerField(verbose_name="이용자 ID")
    site_id = models.IntegerField(verbose_name="사이트 ID", default=0)
    min_career = models.IntegerField(
        verbose_name="최소 경력년수", choices=MIN_CAREER_TYPE, default=0
    )
    group_id = models.IntegerField(verbose_name="그룹 ID", default=0)
    country_id = models.IntegerField(verbose_name="국가 ID", default=0)
    region_id = models.IntegerField(verbose_name="지역 ID", default=0)
    detail_region_id = models.IntegerField(verbose_name="세부 지역 ID", default=0)
    category_ids = models.CharField(
        verbose_name="카테고리 ID 목록", default="0", max_length=50
    )
    skill_ids = models.CharField(verbose_name="스킬 ID 목록", default="0", max_length=50)

    def __str__(self):
        return f"{self.user_id}번 유저의 {self.get_type_display()} 설정"
