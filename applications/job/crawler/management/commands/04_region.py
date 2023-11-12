import csv

from django.core.management.base import BaseCommand

from selenium.webdriver.support.ui import Select

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

        # csv 파일에 추가
        BASE_DIR = "./static/csv/"

        region_file = BASE_DIR + "04_region.csv"

        with open(region_file, "w", newline="", encoding="utf-8") as write_file:
            csv_writer = csv.writer(write_file)

            # 지역 분류 열기
            region_btn = find_visible(wait, "button[data-filter-name=region]")
            region_btn.click()

            country_list = finds_present(
                driver,
                wait,
                "div[id=MODAL_BODY] div[class*=Selector_select] select option",
            )

            idx = 1

            for i, country_option in enumerate(country_list):
                if i in [1, 3, 4]:
                    country_select = find_present(
                        wait, "div[id=MODAL_BODY] div[class*=Selector_select] select"
                    )
                    select = Select(country_select)
                    select.select_by_index(i)
                    selected_country = country_list[i].text
                    print(f"selected_country:{selected_country}")

                    regions_section = finds_present(
                        driver, wait, "div[class*=Locations_column__]"
                    )[0]
                    regions = finds_present(regions_section, wait, "button")
                    for j, region in enumerate(regions):
                        csv_writer.writerow([idx, region.text, selected_country])
                        idx += 1

        with open(region_file, "rt", encoding="UTF8") as read_file:
            content = read_file.readlines()
            for row in content:
                print(row.strip())

        print("크롤링을 종료합니다.")
        driver.quit()
