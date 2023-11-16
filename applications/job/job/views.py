from django.conf import settings

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from job.models import (
    Group,
    Category,
    Country,
    Region,
    DetailRegion,
    Company,
    Recruit,
    Site,
)
from job.serializers import (
    GroupSerializer,
    CategorySerializer,
    CategorySerializer,
    CountrySerializer,
    RegionSerializer,
    DetailRegionSerializer,
    RecruitSerializer,
    SiteSerializer,
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
        categories: Category = Category.objects.all()
        queryset = self.filter_backends().filter_queryset(request, categories, self)
        serializer: CategorySerializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CountryView(APIView):
    serializer_class = CountrySerializer

    def get(self, request: Request):
        categories: Country = Country.objects.all()
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
