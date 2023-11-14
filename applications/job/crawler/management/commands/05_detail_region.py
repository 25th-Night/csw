import csv

from django.core.management.base import BaseCommand

from selenium.webdriver.support.ui import Select

from job.models import Country, Region, DetailRegion

from common.utils import (
    Chrome,
    find_visible,
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

        country_list = finds_present(
            driver,
            wait,
            "div[id=MODAL_BODY] div[class*=Selector_select] select option",
        )

        for i, country_option in enumerate(country_list):
            if i == 4:
                country_select = find_present(
                    wait, "div[id=MODAL_BODY] div[class*=Selector_select] select"
                )
                select = Select(country_select)
                select.select_by_index(i)
                selected_country = country_option.text
                print(f"selected_country:{selected_country}")

                regions_section = finds_present(
                    driver, wait, "div[class*=Locations_column__]"
                )[0]
                regions = finds_present(regions_section, wait, "button")
                for j, region in enumerate(regions):
                    if j:
                        region.click()
                        detail_regions_section = finds_present(
                            driver, wait, "div[class*=Locations_column__]"
                        )[1]
                        detail_regions = finds_present(
                            detail_regions_section, wait, "button"
                        )
                        for k, detail_region in enumerate(detail_regions):
                            if k:
                                print(selected_country, region.text, detail_region.text)
                                _region = Region.objects.get(name=region.text)
                                DetailRegion.objects.get_or_create(
                                    region=_region, name=detail_region.text
                                )
                        x_btn = find_present(
                            wait,
                            "li[class*=SelectedLocations_locationItem__] button",
                        )
                        x_btn.click()

        driver.quit()
        print("크롤링을 종료합니다.")
