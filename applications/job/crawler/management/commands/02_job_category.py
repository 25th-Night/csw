import os
import platform
import time

from django.core.management.base import BaseCommand

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from job.models import Category, Group

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
        if platform.system() in ["Windows", "Darwin"]:
            from dotenv import load_dotenv

            load_dotenv(dotenv_path="../../.envs/.env_job")

        print("hello, it's custom command file")

        # set Driver
        chrome = Chrome()
        driver = chrome.driver
        wait = chrome.wait
        short_wait = chrome.short_wait

        url = "https://www.wanted.co.kr/wdlist?country=kr&job_sort=job.latest_order&years=-1&locations=all"

        driver.get(url)
        print("크롤링을 시작합니다.")

        # 회원가입/로그인 클릭
        find_visible(short_wait, "button[data-gnb-kind=signupLogin]").click()

        # 아이디 입력 후 Enter
        find_visible(wait, "input[type=email]").send_keys(os.getenv("WANTED_ID") + "\n")
        # PW 입력 후 Enter
        find_visible(wait, "input[type=password]").send_keys(
            os.getenv("WANTED_PW") + "\n"
        )

        # 직업 분류 열기
        find_visible(wait, "button[class*=JobGroup_]").click()
        # 직업 분류 목록
        job_groups = finds_present(
            driver, wait, "section[class*=JobGroupOverlay_] li a"
        )

        len_jg = len(job_groups)

        find_visible(wait, "button[class*=JobGroup_]").click()

        for i in range(1, len_jg):
            # 직업 분류 열기
            find_visible(wait, "button[class*=JobGroup_]").click()
            # 직업 분류 목록
            job_groups = finds_present(
                driver, wait, "section[class*=JobGroupOverlay_] li a"
            )
            job_group = job_groups[i]
            if i >= 10:
                job_groups[0].send_keys(Keys.ARROW_DOWN)
                time.sleep(0.5)
            job_group_name = job_group.text
            job_group_id = job_group.get_attribute("href").split("/")[-1]

            time.sleep(0.5)
            if i > 1:
                job_group.click()

            driver.execute_script("window.scrollTo(0, 0);")

            # 직무 분류 열기
            find_visible(wait, "button[class*=JobCategory_]").click()
            # 직무 분류 목록
            job_categories = finds_present(
                driver, wait, "button[class*=JobCategoryItem_]"
            )
            for j, job_category in enumerate(job_categories):
                print(i, job_group_name, j, job_category.text)
                group = Group.objects.get(name=job_group_name)
                Category.objects.get_or_create(group=group, name=job_category.text)

        driver.quit()
        print("크롤링을 종료합니다.")
