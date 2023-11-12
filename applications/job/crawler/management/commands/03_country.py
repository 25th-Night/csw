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

        # 지역 분류 열기
        region_btn = find_visible(wait, "button[data-filter-name=region]")
        region_btn.click()

        # csv 파일에 추가
        BASE_DIR = "./static/csv/"

        region_file = BASE_DIR + "03_country.csv"

        with open(region_file, "w", newline="", encoding="utf-8") as write_file:
            csv_writer = csv.writer(write_file)

            country_options = finds_present(
                driver,
                wait,
                "div[id=MODAL_BODY] div[class*=Selector_select] select option",
            )

            for i, country_option in enumerate(country_options):
                country_name = country_option.text
                country_value = country_option.get_attribute("value")

                csv_writer.writerow([country_value, country_name])

        with open(region_file, "rt", encoding="UTF8") as read_file:
            content = read_file.readlines()
            for row in content:
                print(row.strip())

        print("크롤링을 종료합니다.")
        driver.quit()
