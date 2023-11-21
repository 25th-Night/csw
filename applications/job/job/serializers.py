from rest_framework import serializers

from taggit.models import Tag

from job.models import (
    Group,
    Category,
    Country,
    Region,
    DetailRegion,
    Company,
    JobSetting,
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


class CompanyTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "id",
            "name",
        )


class CompanySerializer(serializers.ModelSerializer):
    detail_region = DetailRegionSerializer()
    tags = CompanyTagSerializer(many=True)

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


class JobSettingSerializer(serializers.Serializer):
    type = serializers.IntegerField(required=False)
    user_id = serializers.IntegerField()
    site_id = serializers.IntegerField(required=False, default=0)
    skills = serializers.SerializerMethodField()
    min_career = serializers.IntegerField(
        required=False, default=0, min_value=-1, max_value=10
    )
    group_id = serializers.IntegerField(required=False, default=0)
    country_id = serializers.IntegerField(required=False, default=0)
    region_id = serializers.IntegerField(required=False, default=0)
    detail_region_id = serializers.IntegerField(required=False, default=0)
    category_ids = serializers.CharField(required=False, default="0")
    skill_ids = serializers.CharField(required=False, default="0", write_only=True)

    def get_skills(self, obj):
        skill_ids = list(map(int, obj.skill_ids.split(",")))
        skills = Skill.objects.filter(id__in=skill_ids)
        serialized_skills = SkillSerializer(skills, many=True)
        return serialized_skills.data

    def validate(self, attrs):
        type = int(attrs.get("type"))
        site_id = int(attrs.get("site_id"))
        group_id = int(attrs.get("group_id"))
        category_ids = attrs.get("category_ids")
        country_id = int(attrs.get("country_id"))
        region_id = int(attrs.get("region_id"))
        detail_region_id = int(attrs.get("detail_region_id"))
        skill_ids = attrs.get("skill_ids")

        if type not in [choice.value for choice in JobSetting.TypeChoices]:
            raise serializers.ValidationError("Not valid Type")

        if site_id and site_id not in Site.objects.all().values_list("id", flat=True):
            raise serializers.ValidationError("Not valid Site ID")

        if group_id:
            if group_id not in Group.objects.all().values_list("id", flat=True):
                raise serializers.ValidationError("Not valid Group ID")
            if category_ids != "0":
                category_ids = list(map(int, attrs.get("category_ids").split(",")))
                category_id_lists = Category.objects.filter(
                    group_id=group_id
                ).values_list("id", flat=True)
                is_sublist = all(
                    category_id in category_id_lists for category_id in category_ids
                )
                if not is_sublist:
                    raise serializers.ValidationError("Not valid Category IDs")
        else:
            if category_ids != "0":
                raise serializers.ValidationError("Not valid Category IDs")

        if country_id:
            if country_id not in Country.objects.all().values_list("id", flat=True):
                raise serializers.ValidationError("Not valid Country ID")

            if region_id:
                region_ids = Region.objects.filter(country_id=country_id).values_list(
                    "id", flat=True
                )
                if region_id not in region_ids:
                    raise serializers.ValidationError("Not valid Region ID")

                if detail_region_id:
                    detail_region_ids = DetailRegion.objects.filter(
                        region_id=region_id
                    ).values_list("id", flat=True)
                    if detail_region_id not in detail_region_ids:
                        raise serializers.ValidationError("Not valid Region ID")
        else:
            if not region_id:
                raise serializers.ValidationError("Not valid Region ID")
            elif not detail_region_id:
                raise serializers.ValidationError("Not valid Detail Region ID")

        if skill_ids != "0":
            skill_ids = list(map(int, attrs.get("skill_ids").split(",")))
            skill_id_lists = Skill.objects.all().values_list("id", flat=True)
            is_sublist = all(skill_id in skill_id_lists for skill_id in skill_ids)
            if not is_sublist:
                raise serializers.ValidationError("Not valid Skill IDs")

        return attrs

    def update(self, instance, validated_data):
        print(f"instance:{instance}")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
