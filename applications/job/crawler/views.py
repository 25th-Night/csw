import time
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

import requests
from crawler.serializers import CrawlingRecruitSerializer
from job.serializers import RecruitSerializer

from job.models import Category, Company, DetailRegion, Recruit, Site, Skill

from crawler.utils import crawling_recruits, make_crawling_data


class RecruitView(APIView):
    serializer_class = CrawlingRecruitSerializer

    def get(self, request: Request):
        year = int(request.GET.get("year"))
        job_group_name = request.GET.get("job_group", None)
        job_category_name = request.GET.get("job_category", None)
        country_name = request.GET.get("country", None)
        region_name = request.GET.get("region", None)
        detail_region_name = request.GET.get("detail_region", None)
        skill = request.GET.get("skill", None)

        retry = 0
        while True:
            recruits = crawling_recruits(
                year,
                job_group_name,
                job_category_name,
                country_name,
                region_name,
                detail_region_name,
                skill,
            )
            if recruits:
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

        crawling = make_crawling_data(
            user_id=request.user.get("id"),
            site_name="Wanted",
            min_career=year,
            job_group_name=job_group_name,
            job_category_name=job_category_name,
            country_name=country_name,
            region_name=region_name,
            detail_region_name=detail_region_name,
            skill=skill,
        )

        existed_recruits = []
        created_recruits = []
        modified_recruits = []
        for recruit in recruits:
            url_id = recruit["url_id"]
            request_url = f"https://www.wanted.co.kr/api/v4/jobs/{url_id}"
            response = requests.get(request_url)
            if response.status_code == 200:
                recruit = response.json()
                # print(f"recruit:{recruit}")
                country = recruit["job"]["address"]["country"]
                region = recruit["job"]["address"]["location"]
                detail_region_split1 = (
                    recruit["job"]["address"]["full_location"].strip().split(" ")
                )
                detail_region_split2 = (
                    recruit["job"]["address"]["geo_location"]["n_location"]["address"]
                    .strip()
                    .split(" ")
                    if recruit["job"]["address"]["geo_location"] is not None
                    else None
                )
                detail_region_list = DetailRegion.objects.all().values_list(
                    "name", flat=True
                )
                detail_region_name = "미등록"
                for detail_region_element in detail_region_split1:
                    if detail_region_element in detail_region_list:
                        detail_region_name = detail_region_element
                        break
                if detail_region_name == "미등록" and detail_region_split2:
                    for detail_region_element in detail_region_split2:
                        if detail_region_element in detail_region_list:
                            detail_region_name = detail_region_element
                            break

                position = recruit["job"]["position"]
                description = recruit["job"]["detail"]["intro"]
                task = recruit["job"]["detail"]["main_tasks"]
                requirement = recruit["job"]["detail"]["requirements"]
                preference = recruit["job"]["detail"]["preferred_points"]
                benefit = recruit["job"]["detail"]["benefits"]
                workplace = recruit["job"]["address"]["full_location"]
                workplace = workplace if workplace else "미등록"
                skill_tags = [skill["title"] for skill in recruit["job"]["skill_tags"]]
                company_tags = [
                    company["title"] for company in recruit["job"]["company_tags"]
                ]
                recruit_status = True if recruit["job"]["status"] == "active" else False
                company_name = recruit["job"]["company"]["name"]
                company_industry = recruit["job"]["company"]["industry_name"]

                recruit_data = {
                    "site_name": "Wanted",
                    "job_category_name": job_category_name,
                    "region_name": region,
                    "detail_region_name": detail_region_name,
                    "company_name": company_name,
                    "company_tags": company_tags,
                    "skills": skill_tags,
                    "min_career": year,
                    "url_id": url_id,
                    "position": position,
                    "description": description,
                    "task": task,
                    "requirement": requirement,
                    "preference": preference,
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
                if data_status == "existed":
                    existed_recruits.append(recruit)
                elif data_status == "created":
                    recruit.crawling = crawling
                    recruit.save()
                    created_recruits.append(recruit)
                elif data_status == "modified":
                    modified_recruits.append(recruit)
            else:
                print(f'crawling "/{url_id}" recruit failed')

        serializer: RecruitSerializer = RecruitSerializer(
            existed_recruits + created_recruits + modified_recruits, many=True
        )

        response_data = {
            "recruits": serializer.data,
            "crawling_recruits_cnt": len(recruits),
            "created_recruits_cnt": len(created_recruits),
            "modified_recruits_cnt": len(modified_recruits),
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
