import csv
import time

import os
import platform

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
        if platform.system() in ["Windows", "Darwin"]:
            from dotenv import load_dotenv

            load_dotenv(dotenv_path="../../.envs/.env_job")

        print("hello, it's custom command file")

        # set Driver
        chrome = Chrome()
        driver = chrome.driver
        wait = chrome.wait
        short_wait = chrome.short_wait

        # csv 파일에 추가
        BASE_DIR = "./static/csv/"

        job_category_file = BASE_DIR + "02_job_category.csv"

        url = "https://www.wanted.co.kr/wdlist?country=kr&job_sort=job.latest_order&years=-1&locations=all"

        driver.get(url)
        print("크롤링을 시작합니다.")

        # 회원가입/로그인 클릭
        find_visible(short_wait, "button[data-gnb-kind=signupLogin]").click()
        # find_visible(short_wait, 'button.signUpButton').click()
        # find_visible(short_wait, 'button#gnbSignupBtn').click()

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
        index = 1
        find_visible(wait, "button[class*=JobGroup_]").click()

        with open(job_category_file, "w", newline="", encoding="utf-8") as write_file:
            csv_writer = csv.writer(write_file)
            for i in range(1, len_jg):
                # 직업 분류 열기
                find_visible(wait, "button[class*=JobGroup_]").click()
                # 직업 분류 목록
                job_groups = finds_present(
                    driver, wait, "section[class*=JobGroupOverlay_] li a"
                )
                job_group = job_groups[i]
                job_group_id = job_group.get_attribute("href").split("/")[-1]

                if i > 1:
                    job_group.click()

                # 직무 분류 열기
                find_visible(wait, "button[class*=JobCategory_]").click()
                # 직무 분류 목록
                job_categories = finds_present(
                    driver, wait, "button[class*=JobCategoryItem_]"
                )
                for j, job_category in enumerate(job_categories):
                    csv_writer.writerow([index, job_category.text, job_group_id])
                    index += 1

                # 선택 완료 버튼 클릭
                finds_visible(driver, wait, "button[class*=Button_Button]")[0].click()

        driver.quit()
        print("크롤링을 종료합니다.")

        with open(job_category_file, "rt", encoding="UTF8") as read_file:
            content = read_file.readlines()
            for row in content:
                print(row.strip())
