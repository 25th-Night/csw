from django.core.management.base import BaseCommand

from job.models import Country

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

        if not Country.objects.exists():
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

            country_options = finds_present(
                driver,
                wait,
                "div[id=MODAL_BODY] div[class*=Selector_select] select option",
            )

            for i, country_option in enumerate(country_options):
                print(i, country_option.text, country_option.get_attribute("value"))
                Country.objects.get_or_create(name=country_option.text)

            driver.quit()
            print("크롤링을 종료합니다.")
        else:
            print("데이터가 존재하기 때문에 크롤링을 진행하지 않습니다.")
