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


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = (
            "id",
            "name",
        )


class CategorySerializer(serializers.ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "group",
        )


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = (
            "id",
            "name",
        )


class RegionSerializer(serializers.ModelSerializer):
    country = CountrySerializer()

    class Meta:
        model = Region
        fields = (
            "id",
            "name",
            "country",
        )


class DetailRegionSerializer(serializers.ModelSerializer):
    region = RegionSerializer()

    class Meta:
        model = DetailRegion
        fields = (
            "id",
            "name",
            "region",
        )


class CompanySerializer(serializers.ModelSerializer):
    detail_region = DetailRegionSerializer()
    tags = TagListSerializerField()

    class Meta:
        model = Company
        fields = (
            "id",
            "name",
            "detail_region",
            "tags",
        )


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = (
            "id",
            "name",
        )


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = (
            "id",
            "name",
        )


class RecruitSerializer(serializers.ModelSerializer):
    site = SiteSerializer()
    detail_region = DetailRegionSerializer()
    company = CompanySerializer()
    skills = SkillSerializer(many=True)
    categories = CategorySerializer(many=True)

    class Meta:
        model = Recruit
        exclude = ("is_active",)
