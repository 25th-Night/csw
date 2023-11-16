import csv

from django.core.management.base import BaseCommand

from selenium.webdriver.support.ui import Select

from taggit.models import Tag

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

        company_tags_list = finds_present(
            driver,
            wait,
            "div[class=slick-track] button",
        )

        for i, company_tag in enumerate(company_tags_list):
            Tag.objects.get_or_create(name=company_tag.text)

        driver.quit()
        print("크롤링을 종료합니다.")
