import time
import json

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import serializers

from bs4 import BeautifulSoup as BS
import requests as req

import requests
from crawler.serializers import CrawlingRecruitSerializer
from job.serializers import RecruitSerializer, SkillSerializer

from job.models import (
    Category,
    Company,
    DetailRegion,
    Group,
    Recruit,
    Region,
    Site,
    Skill,
)

from crawler.utils import crawling_recruits, make_crawling_data


class RecruitView(GenericAPIView):
    serializer_class = CrawlingRecruitSerializer

    def post(self, request: Request):
        print(request.data)

        min_career = int(request.data.get("min_career"))
        user_id = request.user.get("id")
        site_id = int(request.data.get("site_id"))
        group_id = int(request.data.get("group_id"))  # 그냥 써도 됨
        category_ids = request.data.get("category_ids")
        country_id = int(request.data.get("country_id"))
        region_id = int(request.data.get("region_id"))
        detail_region_id = int(request.data.get("detail_region_id"))
        skill_ids = request.data.get("skill_ids")

        if min_career > 0:
            year = min_career
        elif not min_career:
            year = None
            response_data = {"detail": "Please select Minimum Career Year"}
            print(response_data)
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        elif min_career == -1:
            year = 0
        if group_id:
            group_idx = group_id - 1

            if category_ids in [0, "0"]:
                # category_id_list, category_name_list = None, None
                response_data = {"detail": "Please select Category"}
                print(response_data)
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            elif type(category_ids) == int and category_ids:
                category_id_list = [category_ids]
                category_name_list = [Category.objects.get(id=category_ids).name]
            else:
                category_id_list = list(map(int, category_ids.split(",")))
                category_name_list = Category.objects.filter(
                    id__in=category_id_list
                ).values_list("name", flat=True)

        else:
            response_data = {"detail": 'Please select "Job Group" type'}

        country_idx = country_id - 1 if country_id else country_id
        region_name, detail_region_name = None, None
        if country_idx in [1, 3, 4]:
            if region_id:
                region_name = Region.objects.get(id=region_id).name
            else:
                region_name = "전국" if country_idx == 4 else "All"

            if country_idx == 4 and region_id:
                detail_region_name = (
                    DetailRegion.objects.get(id=detail_region_id).name
                    if detail_region_id
                    else "전체"
                )

        if group_id == 1 and skill_ids in ["0", 0]:
            # skill_id_list, skill_name_list = None, None
            response_data = {"detail": "Please select Skill"}
            print(response_data)
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        elif group_id != 1:
            skill_id_list, skill_name_list = None, None
        elif type(skill_ids) == int and skill_ids:
            skill_id_list = [skill_ids]
            skill_name_list = [Skill.objects.get(id=skill_ids).name]
        else:
            skill_id_list = list(map(int, skill_ids.split(",")))
            skill_name_list = Skill.objects.filter(id__in=skill_id_list).values_list(
                "name", flat=True
            )

        retry = 0
        while True:
            recruit_url_id_list = crawling_recruits(
                year,
                group_idx,
                category_name_list,
                country_idx,
                region_name,
                detail_region_name,
                skill_name_list,
            )
            if recruit_url_id_list:
                break
            else:
                time.sleep(1)
                retry += 1
                print("retry to crawling recruit list")
                if retry == 5:
                    return Response(
                        {"detail": "crawling recruit list failed"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        print(f"recruit_url_id_list:{recruit_url_id_list}")

        crawling = make_crawling_data(
            user_id=user_id,
            site_id=1,  # 추후 서비스 확장시 site_id로 수정 필요
            min_career=year,
            group_id=group_id,
            category_id_list=category_id_list,
            country_id=country_id,
            region_id=region_id,
            detail_region_id=detail_region_id,
            skill_id_list=skill_id_list,
        )
        print(f"created crawling data : {crawling.__dict__}")

        try:
            total_crawled_cnt = 0
            crawling_recruit_list = []
            existed_recruit_idx_list = []
            created_recruit_idx_list = []
            modified_recruit_idx_list = []
            for recruit_url_id in recruit_url_id_list:
                request_url = f"https://www.wanted.co.kr/api/v4/jobs/{recruit_url_id}"
                response = requests.get(request_url)
                if response.status_code == 200:
                    recruit = response.json()
                    # print(f"recruit:{recruit}")

                    skill_found = True
                    recruit_skill_list = recruit["job"]["skill_tags"]
                    if recruit_skill_list and skill_name_list:
                        recruit_skill_name_list = [
                            recruit_skill["title"]
                            for recruit_skill in recruit_skill_list
                        ]
                        for skill_name in skill_name_list:
                            if skill_name not in recruit_skill_name_list:
                                skill_found = False
                                break

                    if not skill_found:
                        continue

                    country = recruit["job"]["address"]["country"]
                    region = recruit["job"]["address"]["location"]
                    detail_region_split1 = (
                        recruit["job"]["address"]["full_location"].strip().split(" ")
                    )
                    detail_region_split2 = None
                    geo_location = recruit["job"]["address"]["geo_location"]
                    if geo_location is not None:
                        detail_region2 = recruit["job"]["address"]["geo_location"][
                            "n_location"
                        ]["address"]
                        detail_region_split2 = (
                            detail_region2.strip().split(" ")
                            if detail_region2 is not None
                            else None
                        )
                    detail_region_list = DetailRegion.objects.all().values_list(
                        "name", flat=True
                    )
                    detail_region_name = "미등록"
                    for detail_region_element in detail_region_split1:
                        if (
                            detail_region_element in detail_region_list
                            and region in detail_region_split1
                        ):
                            detail_region_name = detail_region_element
                            break
                    if detail_region_name == "미등록" and detail_region_split2:
                        for detail_region_element in detail_region_split2:
                            if (
                                detail_region_element in detail_region_list
                                and region in detail_region_split2
                            ):
                                detail_region_name = detail_region_element
                                break

                    recruit_data = {}
                    position = recruit["job"]["position"]
                    description = recruit["job"]["detail"]["intro"]
                    task = recruit["job"]["detail"]["main_tasks"]
                    requirement = recruit["job"]["detail"]["requirements"]
                    preference = recruit["job"]["detail"]["preferred_points"]
                    if preference:
                        recruit_data["preference"] = preference
                    benefit = recruit["job"]["detail"]["benefits"]
                    workplace = recruit["job"]["address"]["full_location"]
                    workplace = workplace if workplace else "미등록"
                    skill_tags = [
                        skill["title"] for skill in recruit["job"]["skill_tags"]
                    ]
                    company_tags = [
                        company["title"] for company in recruit["job"]["company_tags"]
                    ]
                    recruit_status = (
                        True if recruit["job"]["status"] == "active" else False
                    )
                    company_name = recruit["job"]["company"]["name"]
                    company_industry = recruit["job"]["company"]["industry_name"]

                    min_career = min_career if min_career > 0 else 0

                    recruit_data = {
                        "site_name": "Wanted",
                        "min_career": min_career,
                        "job_categories": category_name_list,
                        "region_name": region,
                        "detail_region_name": detail_region_name,
                        "company_name": company_name,
                        "company_tags": company_tags,
                        "skills": skill_tags,
                        "min_career": year,
                        "url_id": recruit_url_id,
                        "position": position,
                        "description": description,
                        "task": task,
                        "requirement": requirement,
                        "benefit": benefit,
                        "workplace": workplace,
                        "status": recruit_status,
                    }
                    # print(f"recruit_data:{recruit_data}")

                    serializer: CrawlingRecruitSerializer = CrawlingRecruitSerializer(
                        data=recruit_data
                    )

                    if not serializer.is_valid():
                        print(serializer.errors)
                    serializer.is_valid(raise_exception=True)
                    recruit, data_status = serializer.get_or_create(
                        serializer.validated_data
                    )
                    if data_status == "created":
                        recruit.crawling = crawling
                        recruit.save()
                        created_recruit_idx_list.append(total_crawled_cnt)
                    elif data_status == "existed":
                        existed_recruit_idx_list.append(total_crawled_cnt)
                    elif data_status == "modified":
                        modified_recruit_idx_list.append(total_crawled_cnt)
                    crawling_recruit_list.append(recruit)
                    total_crawled_cnt += 1
                else:
                    print(f'crawling "/{recruit_url_id}" recruit failed')
        except:
            crawling.delete()
            return Response(
                {"detail": "Failed to Crawling"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        serializer: RecruitSerializer = RecruitSerializer(
            crawling_recruit_list, many=True
        )

        response_data = {
            "recruits": serializer.data,
            "created_recruit_idx_list": created_recruit_idx_list,
            "existed_recruit_idx_list": existed_recruit_idx_list,
            "modified_recruit_idx_list": modified_recruit_idx_list,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class RecruitDetailView(APIView):
    def get(self, request: Request, url):
        request_url = f"https://www.wanted.co.kr/api/v4/jobs/{url}"

        response = requests.get(request_url)
        if response.status_code == 200:
            recruit = response.json()
            print(recruit)
            return Response(recruit, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Recruit not found"})


class SkillSearchView(APIView):
    serializer_class = SkillSerializer

    def get(self, request: Request):
        keyword = self.request.GET.get("keyword")

        url = f"https://www.wanted.co.kr/api/v4/tags/autocomplete?kinds=SKILL&keyword={keyword}"
        res = req.get(url)
        if res.status_code == 200:
            soup = BS(res.text, "html.parser")

            response_dict = json.loads(soup.prettify())
            results = response_dict.get("results")
            searched_skills = (
                [
                    Skill.objects.get_or_create(name=result.get("title"))[0]
                    for result in results
                ]
                if results
                else results
            )
            serializer: SkillSerializer = self.serializer_class(
                searched_skills, many=True
            )

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("detail: Bad Request", status=res.status_code)
