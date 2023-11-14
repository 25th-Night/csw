from rest_framework import serializers

from taggit.serializers import TagListSerializerField

from job.models import (
    Group,
    Category,
    Country,
    Region,
    DetailRegion,
    Company,
    Site,
    Skill,
    Recruit,
)


class CrawlingRecruitSerializer(serializers.Serializer):
    site_name = serializers.CharField()
    job_category_name = serializers.CharField()
    region_name = serializers.CharField()
    detail_region_name = serializers.CharField()
    company_name = serializers.CharField()
    company_tags = serializers.ListField()
    skills = serializers.ListField()
    min_career = serializers.IntegerField()
    url_id = serializers.CharField()
    position = serializers.CharField()
    description = serializers.CharField()
    task = serializers.CharField()
    requirement = serializers.CharField()
    preference = serializers.CharField()
    benefit = serializers.CharField()
    workplace = serializers.CharField()
    status = serializers.BooleanField()

    def get_or_create(self, validated_data):
        site_name = validated_data.pop("site_name")
        job_category_name = validated_data.pop("job_category_name")
        region_name = validated_data.pop("region_name")
        detail_region_name = validated_data.pop("detail_region_name")
        company_name = validated_data.pop("company_name")
        company_tags = validated_data.pop("company_tags")
        skills = validated_data.pop("skills")
        min_career = validated_data.pop("min_career")

        site = Site.objects.get(name=site_name)
        category = Category.objects.get(name=job_category_name)
        if detail_region_name != "미등록":
            detail_region = DetailRegion.objects.get(name=detail_region_name)
        else:
            region = Region.objects.get(name=region_name)
            detail_region = DetailRegion.objects.get_or_create(
                name=detail_region_name, region=region
            )[0]
        company, company_created = Company.objects.get_or_create(
            name=company_name, detail_region=detail_region
        )
        if company_created:
            company.tags.add(*company_tags)
        skills = [
            Skill.objects.get_or_create(name=skill_name)[0] for skill_name in skills
        ]

        recruit, created = Recruit.objects.get_or_create(
            site=site,
            detail_region=detail_region,
            company=company,
            **validated_data,
            defaults={"min_career": min_career},
        )
        status = "existed"
        if created:
            recruit.categories.add(category)
            recruit.skills.add(*skills)
            status = "created"
        else:
            if recruit.min_career != min(recruit.min_career, min_career):
                recruit.min_career = min(recruit.min_career, min_career)
                recruit.save()
                status = "modified"

        return recruit, status
