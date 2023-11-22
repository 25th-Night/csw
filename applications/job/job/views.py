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
    JobSetting,
    Region,
    DetailRegion,
    Company,
    Recruit,
    Site,
    Skill,
)
from job.serializers import (
    CompanyTagSerializer,
    GroupSerializer,
    CategorySerializer,
    CategorySerializer,
    CountrySerializer,
    JobSettingSerializer,
    RegionSerializer,
    DetailRegionSerializer,
    RecruitSerializer,
    SiteSerializer,
    SkillSerializer,
)
from job.filters import (
    CategoryFilter,
    DetailRegionFilter,
    RecruitFilter,
    RegionFilter,
    SkillFilter,
)
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
    filter_backends = DjangoFilterBackend
    filterset_class = SkillFilter

    def get(self, request: Request):
        skills: Skill = Skill.objects.all().order_by("name")
        queryset = self.filter_backends().filter_queryset(request, skills, self)
        serializer: SkillSerializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CompanyTagView(APIView):
    serializer_class = CompanyTagSerializer

    def get(self, request: Request):
        company_tags: Tag = Tag.objects.all()
        serializer: CompanyTagSerializer = self.serializer_class(
            company_tags, many=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitView(GenericAPIView):
    serializer_class = RecruitSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RecruitFilter

    def get_queryset(self):
        recruits = Recruit.objects.all()
        return recruits

    def filter_queryset(self, queryset):
        queryset = self.filter_backends[0]().filter_queryset(
            self.request, queryset, self
        )
        return queryset

    def get(self, request: Request):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer: RecruitSerializer = self.get_serializer(page, many=True)
            data_list = self.get_paginated_response(serializer.data).data.get("results")
            url_list = [data.get("url_id") for data in data_list]
            print(f"url_list:{url_list}")
            response_data = self.get_paginated_response(serializer.data)
            response_data.data["page_size"] = self.pagination_class.page_size
            return response_data

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RecruitDetailView(APIView):
    serializer_class = RecruitSerializer

    def get(self, request: Request, pk):
        recruit: Recruit = get_object_or_404(Recruit, id=pk)
        serializer: RecruitSerializer = self.serializer_class(recruit)

        return Response(serializer.data, status=status.HTTP_200_OK)


class JobSettingView(APIView):
    serializer_class = JobSettingSerializer

    def get(self, request: Request, type):
        user_id = request.user.get("id")
        recruit_setting = JobSetting.objects.filter(type=type, user_id=user_id)
        if recruit_setting.exists():
            recruit_setting: JobSetting = recruit_setting.last()
        else:
            recruit_setting: JobSetting = JobSetting.objects.create(
                type=type,
                user_id=user_id,
                site_id=1,
                country_id=5,
            )
        serializer: JobSettingSerializer = self.serializer_class(recruit_setting)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request: Request, type):
        print(f"request.data:{request.data}")
        user_id = request.user.get("id")
        recruit_setting = get_object_or_404(JobSetting, type=type, user_id=user_id)
        print(f"recruit_setting:{recruit_setting.__dict__}")

        # return Response(status=status.HTTP_200_OK)
        request_data = request.data
        request_data["user_id"] = user_id
        serializer: JobSettingSerializer = self.serializer_class(
            recruit_setting, data=request_data
        )

        if not serializer.is_valid():
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
