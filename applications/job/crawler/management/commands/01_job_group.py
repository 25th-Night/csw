import os

from django.core.management.base import BaseCommand

from selenium.webdriver.common.keys import Keys

from job.models import Group, Site

from common.utils import (
    Chrome,
    find_visible,
    finds_present,
)


# TODO: 커맨드 활용
# https://docs.djangoproject.com/en/4.2/howto/custom-management-commands/#testing
class Command(BaseCommand):
    help = "Test Crawling"

    def handle(self, *args, **options):
        print("hello, it's custom command file")

        if not Group.objects.exists():
            # set Driver
            chrome = Chrome()
            driver = chrome.driver
            wait = chrome.wait

            url = "https://www.wanted.co.kr/wdlist?country=kr&job_sort=job.latest_order&years=-1&locations=all"

            driver.get(url)
            print("크롤링을 시작합니다.")

            # 직업 분류 열기
            find_visible(wait, "button[class*=JobGroup_]").click()
            # 직업 분류 목록
            job_groups = finds_present(
                driver, wait, "section[class*=JobGroupOverlay_] li a"
            )

            for i, job_group in enumerate(job_groups):
                if not i:
                    job_group.send_keys(Keys.ARROW_DOWN)
                job_group_name = job_group.text
                job_group_id = job_group.get_attribute("href").split("/")[-1]
                print(i, job_group_name, job_group_id)

                Group.objects.get_or_create(name=job_group_name, index=job_group_id)

            Site.objects.get_or_create(name="Wanted")

            driver.quit()
            print("크롤링을 종료합니다.")
        else:
            print("데이터가 존재하기 때문에 크롤링을 진행하지 않습니다.")
