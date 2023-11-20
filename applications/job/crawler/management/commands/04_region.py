from django.core.management.base import BaseCommand

from selenium.webdriver.support.ui import Select

from job.models import Country, Region

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

        if not Region.objects.exists():
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

            idx = 0

            for i, country_option in enumerate(country_list):
                if i in [1, 3, 4]:
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
                            print(i, selected_country, j, region.text)
                            _country = Country.objects.get(name=selected_country)
                            Region.objects.get_or_create(
                                country=_country, name=region.text
                            )

            driver.quit()
            print("크롤링을 종료합니다.")
        else:
            print("데이터가 존재하기 때문에 크롤링을 진행하지 않습니다.")
