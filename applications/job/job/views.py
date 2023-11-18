from django.conf import settings

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from taggit.models import Tag

from job.models import (
    Group,
    Category,
    Country,
    RecruitSetting,
    Region,
    DetailRegion,
    Company,
    Recruit,
    Site,
    Skill,
)
from job.serializers import (
    GroupSerializer,
    CategorySerializer,
    CategorySerializer,
    CountrySerializer,
    RecruitSettingSerializer,
    RegionSerializer,
    DetailRegionSerializer,
    RecruitSerializer,
    SiteSerializer,
    SkillSerializer,
)
from job.filters import CategoryFilter, DetailRegionFilter, RecruitFilter, RegionFilter
from common.utils import get_object_or_404


class SiteView(APIView):
    serializer_class = SiteSerializer

    def get(self, request: Request):
        sites: Site = Site.objects.all()
        serializer: SiteSerializer = self.serializer_class(sites, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupView(APIView):
    serializer_class = GroupSerializer

    def get(self, request: Request):
        groups: Group = Group.objects.all()
        serializer: GroupSerializer = self.serializer_class(groups, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryView(APIView):
    serializer_class = CategorySerializer
    filter_backends = DjangoFilterBackend
    filterset_class = CategoryFilter

    def get(self, request: Request):
        categories: Category = Category.objects.exclude(name__contains="전체")
        queryset = self.filter_backends().filter_queryset(request, categories, self)
        serializer: CategorySerializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CountryView(APIView):
    serializer_class = CountrySerializer

    def get(self, request: Request):
        categories: Country = Country.objects.exclude(name__contains="전세계")
        serializer: CountrySerializer = self.serializer_class(categories, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RegionView(APIView):
    serializer_class = RegionSerializer
    filter_backends = DjangoFilterBackend
    filterset_class = RegionFilter

    def get(self, request: Request):
        regions: Region = Region.objects.all()
        queryset = self.filter_backends().filter_queryset(request, regions, self)
        serializer: RegionSerializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DetailRegionView(APIView):
    serializer_class = DetailRegionSerializer
    filter_backends = DjangoFilterBackend
    filterset_class = DetailRegionFilter

    def get(self, request: Request):
        detail_regions: DetailRegion = DetailRegion.objects.all()
        queryset = self.filter_backends().filter_queryset(request, detail_regions, self)
        serializer: DetailRegionSerializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SkillView(APIView):
    serializer_class = SkillSerializer

    def get(self, request: Request):
        skills: Skill = Skill.objects.all()
        serializer: SkillSerializer = self.serializer_class(skills, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CompanyTagView(APIView):
    serializer_class = SkillSerializer

    def get(self, request: Request):
        company_tags: Tag = Tag.objects.all()
        serializer: SkillSerializer = self.serializer_class(company_tags, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitView(APIView):
    serializer_class = RecruitSerializer
    filter_backends = DjangoFilterBackend
    filterset_class = RecruitFilter

    def get(self, request: Request):
        recruits: Recruit = Recruit.objects.all()
        queryset = self.filter_backends().filter_queryset(request, recruits, self)
        serializer: RecruitSerializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitDetailView(APIView):
    serializer_class = RecruitSerializer

    def get(self, request: Request, pk):
        recruit: Recruit = get_object_or_404(Recruit, id=pk)
        serializer: RecruitSerializer = self.serializer_class(recruit)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitSettingView(APIView):
    serializer_class = RecruitSettingSerializer

    def get(self, request: Request):
        user_id = request.user.get("id")
        recruit_setting = RecruitSetting.objects.filter(user_id=user_id)
        if recruit_setting.exists():
            recruit_setting: RecruitSetting = recruit_setting.last()
        else:
            recruit_setting: RecruitSetting = RecruitSetting.objects.create(
                user_id=user_id, site_id=1, country_id=5
            )
        serializer: RecruitSettingSerializer = self.serializer_class(recruit_setting)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request: Request):
        print(f"request.data:{request.data}")
        user_id = request.user.get("id")
        recruit_setting = get_object_or_404(RecruitSetting, user_id=user_id)
        print(f"recruit_setting:{recruit_setting.__dict__}")

        # return Response(status=status.HTTP_200_OK)

        serializer: RecruitSettingSerializer = self.serializer_class(
            recruit_setting, data=request.data
        )

        if not serializer.is_valid():
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        recruit_setting = serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
