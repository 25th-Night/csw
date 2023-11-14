import os
import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys

from common.utils import (
    Chrome,
    find_visible,
    finds_visible,
    find_present,
    finds_present,
    click_skill_btn,
)


def crawling_recruits(
    year,
    job_group_name,
    job_category_name,
    country_name,
    region_name,
    detail_region_name,
    skill,
):
    chrome = Chrome()
    driver = chrome.driver
    wait = chrome.wait
    short_wait = chrome.short_wait

    url = f"https://www.wanted.co.kr/wdlist?country=kr&job_sort=job.latest_order&locations=all&years={year}"

    driver.get(url)

    try:
        # login
        find_visible(short_wait, "button[data-gnb-kind=signupLogin]").click()
        find_visible(wait, "input[type=email]").send_keys(os.getenv("WANTED_ID") + "\n")
        find_visible(wait, "input[type=password]").send_keys(
            os.getenv("WANTED_PW") + "\n"
        )

        # job_group
        find_visible(wait, "button[class*=JobGroup_]").click()
        job_groups = finds_present(
            driver, wait, "section[class*=JobGroupOverlay_] li a"
        )
        for i, job_group in enumerate(job_groups):
            if job_group_name == job_group.text:
                job_group.click()
                break

        # job_category
        find_visible(wait, "button[class*=JobCategory_]").click()
        job_categories = finds_present(driver, wait, "button[class*=JobCategoryItem_]")
        for i, job_category in enumerate(job_categories):
            if job_category_name == job_category.text:
                job_category.click()
                break

        # job_category confirm btn
        finds_visible(driver, wait, "button[class*=Button_Button]")[0].click()

        # stack
        find_visible(wait, "button[data-filter-name=skill]").click()
        input_skill_tag = find_visible(
            wait, "div[class*=SkillsSearch_SkillsSearch__] input"
        )
        skill = click_skill_btn(wait, input_skill_tag, skill)
        if not skill:
            driver.quit()
            return False
        else:
            finds_present(driver, wait, "span[class*=Button_Button__interaction]")[
                2
            ].click()

            # country
            find_visible(wait, "button[data-filter-name=region]").click()

            country_select = find_visible(
                wait, "div[id=MODAL_BODY] div[class*=Selector_select] select"
            )
            country_options = finds_visible(
                driver,
                wait,
                "div[id=MODAL_BODY] div[class*=Selector_select] select option",
            )
            for country_idx, country_option in enumerate(country_options):
                if country_name == country_option.text:
                    select = Select(country_select)
                    select.select_by_index(country_idx)

                    # region
                    if country_idx in [1, 3, 4]:
                        regions_section = finds_present(
                            driver, wait, "div[class*=Locations_column__]"
                        )[0]
                        regions = finds_present(regions_section, wait, "button")
                        for i, region in enumerate(regions):
                            if region_name == region.text:
                                if i >= 8:
                                    region.send_keys(Keys.ARROW_DOWN)
                                region.click()
                                # detail_region
                                if country_idx == 4 and region_name != "전국":
                                    detail_regions_section = finds_present(
                                        driver, wait, "div[class*=Locations_column__]"
                                    )[1]
                                    detail_regions = finds_present(
                                        detail_regions_section, wait, "button"
                                    )
                                    for j, detail_region in enumerate(detail_regions):
                                        if (
                                            detail_region_name != "전체"
                                            and detail_region_name == detail_region.text
                                        ):
                                            if j >= 8:
                                                detail_region.send_keys(Keys.ARROW_DOWN)
                                            detail_region.click()
                                            break

                                    break
                        break

            # _region confirm btn
            find_visible(wait, "button[class*=CommonFooter_button__").click()

            # scroll down
            prev_height = driver.execute_script("return document.body.scrollHeight")
            print(f"prev_height:{prev_height}")

            while True:
                driver.execute_script("window.scrollBy(0, 5000)")
                time.sleep(0.5)

                new_height = driver.execute_script("return document.body.scrollHeight")

                print(
                    f"prev_height:{prev_height}, new_height:{new_height}, {prev_height == new_height}"
                )
                if new_height == prev_height:
                    break

                prev_height = new_height
                print(f"prev_height:{prev_height}, new_height:{new_height}")
                time.sleep(0.5)

            # add crawling data
            crawling_result = []
            time.sleep(0.3)
            companies = finds_visible(
                driver, wait, "div[class*=List_List_container__] li"
            )
            for i, company in enumerate(companies):
                link = company.find_element(By.TAG_NAME, "a").get_attribute("href")
                url_id = link.split("/")[-1]
                company_ = company.find_element(
                    By.CSS_SELECTOR, "div.job-card-company-name"
                ).text
                position = company.find_element(
                    By.CSS_SELECTOR, "div.job-card-position"
                ).text
                location = company.find_element(
                    By.CSS_SELECTOR, "div.job-card-company-location"
                ).text
                region, country = location.split(".")
                reward = company.find_element(By.CSS_SELECTOR, "div.reward").text
                recruit_info = {
                    "url_id": url_id,
                    "company": company_,
                    "position": position,
                    "region": region,
                    "country": country,
                    "reward": reward,
                }
                if region_name != "전국" and region_name == region:
                    crawling_result.append(recruit_info)

            driver.quit()
            return crawling_result
    except Exception as e:
        print(f"Raised exception: {e}")
        return False


def crawling_recruit_detail(url):
    chrome = Chrome()
    driver = chrome.driver
    wait = chrome.wait
    short_wait = chrome.short_wait

    recruit_url = f"https://www.wanted.co.kr/wd/{url}"

    driver.get(recruit_url)

    try:
        position = find_present(wait, "section[class*=JobHeader_className__] h2").text
        company = find_present(wait, "section[class*=JobHeader_className__] h6 a").text
        region_country = find_present(
            wait, "span[class*=JobHeader_pcLocationContainer__]"
        ).text
        region, country = region_country.split(".")
        tags = finds_present(driver, wait, "div[class*=Tags_tagsClass__] a")
        tags = [tag.text.replace("#", "") for tag in tags]

        job_details = finds_present(
            driver, wait, "section[class*=JobDescription_JobDescription__] p"
        )

        skills = job_details[5].text.split("\n")

        recruit_information = {
            "url_id": url,
            "position": position,
            "company": company,
            "region": region,
            "country": country,
            "tags": tags,
            "description": job_details[0].text,
            "task": job_details[1].text,
            "requirement": job_details[2].text,
            "preference": job_details[3].text,
            "benefit": job_details[4].text,
            "skill": skills,
        }

        driver.quit()
        return recruit_information
    except Exception as e:
        print(f"Raised exception: {e}")
        return False