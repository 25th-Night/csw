import csv

from django.core.management.base import BaseCommand

from common.utils import (
    Chrome,
    find_visible,
    finds_visible,
    find_present,
    finds_present,
)


# TODO: 커맨드 활용
# https://docs.djangoproject.com/en/4.2/howto/custom-management-commands/#testing
class Command(BaseCommand):
    help = "Test Crawling"

    def handle(self, *args, **options):
        print("hello, it's custom command file")

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

        # csv 파일에 추가
        BASE_DIR = "./static/csv/"

        job_group_file = BASE_DIR + "01_job_group.csv"

        with open(job_group_file, "w", newline="", encoding="utf-8") as write_file:
            csv_writer = csv.writer(write_file)

            for i, job_group in enumerate(job_groups):
                job_group_name = job_group.text
                job_group_id = job_group.get_attribute("href").split("/")[-1]
                print(i, job_group.text, job_group.get_attribute("href").split("/")[-1])

                csv_writer.writerow([job_group_id, job_group_name])

        with open(job_group_file, "rt", encoding="UTF8") as read_file:
            content = read_file.readlines()
            for row in content:
                print(row.strip())

        print("크롤링을 종료합니다.")
        driver.quit()
