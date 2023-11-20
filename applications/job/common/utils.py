import jwt
from jwt.exceptions import DecodeError, ExpiredSignatureError

from django.conf import settings

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium_stealth import stealth


from webdriver_manager.chrome import ChromeDriverManager

from common.exceptions import GenericAPIException


def _get_queryset(klass):
    if hasattr(klass, "_default_manager"):
        return klass._default_manager.all()
    return klass


def get_object_or_404(klass, *args, **kwargs):
    queryset = _get_queryset(klass)
    if not hasattr(queryset, "get"):
        klass__name = (
            klass.__name__ if isinstance(klass, type) else klass.__class__.__name__
        )
        raise ValueError(
            "First argument to get_object_or_404() must be a Model, Manager, "
            "or QuerySet, not '%s'." % klass__name
        )
    try:
        return queryset.get(*args, **kwargs)
    except queryset.model.DoesNotExist:
        return Response(
            {"detail": "Object not found"}, status=status.HTTP_404_NOT_FOUND
        )


def check_access_token_valid(request):
    access_token = request.COOKIES.get("access")
    if not access_token:
        response = {
            "detail": "login required",
        }
        raise GenericAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=response
        )
    key = settings.SIMPLE_JWT.get("SIGNING_KEY")
    algorithm = settings.SIMPLE_JWT.get("ALGORITHM")
    try:
        decoded_jwt = jwt.decode(access_token, key, algorithm)
        return "Valid"
    except DecodeError:
        return "DecodeError"
    except ExpiredSignatureError:
        return "ExpiredSignatureError"


def get_token_from_request(request: Request):
    access_token = None
    print(f"request.__dict__:{request.__dict__}")
    print(request.headers)
    print(request.COOKIES)
    print(request.COOKIES.get("access"))
    cookie = request.headers.get("Cookie", None)
    print(cookie)
    if cookie:
        for content in cookie.split("; "):
            if content.startswith("access"):
                access_token = content[7:]
                break
    return access_token


def get_refresh_token_from_request(request: Request):
    refresh_token = None
    cookie = request.headers.get("Cookie", None)
    if cookie:
        for content in cookie.split("; "):
            if content.startswith("refresh"):
                refresh_token = content[8:]
                break
    return refresh_token


def get_user_id_from_request(request: Request):
    access_token = get_token_from_request(request)
    if not access_token:
        response = {
            "detail": "login required",
        }
        raise GenericAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=response
        )
    key = settings.SIMPLE_JWT.get("SIGNING_KEY")
    algorithm = settings.SIMPLE_JWT.get("ALGORITHM")
    decoded_jwt = jwt.decode(access_token, key, algorithm)
    user_id = decoded_jwt.get("user_id")

    return user_id


def get_user_info_via_authorization(request: Request):
    access_token = get_token_from_request(request)
    auth_url = f"{settings.REQUEST_USER_DOMAIN}/api/user/auth"
    print(f"auth_url: {auth_url}")
    cookies = {"access": access_token}
    print(f"cookies: {cookies}")

    try:
        response = requests.get(auth_url, cookies=cookies)
        response.raise_for_status()
        print(f"response.json(): {response.json()}")
        if response.status_code == 200:
            user = response.json()
            return user
        else:
            return {"detail": "User not found"}
    except requests.exceptions.HTTPError as err:
        print(f"HTTP 오류 발생: {err}")
    except requests.exceptions.RequestException as err:
        print(f"요청 예외 발생: {err}")
    except Exception as err:
        print(f"다른 예외 발생: {err}")


def refresh_access_token(request: Request):
    refresh_token = get_refresh_token_from_request(request)
    cookies = {"refresh": refresh_token}
    refresh_url = f"{settings.REQUEST_USER_DOMAIN}/api/user/refresh"
    response = requests.post(refresh_url)

    if response.status_code == 200:
        token = response.json().get("token")
        access_token = token.get("access_token")
        refresh_token = token.get("refresh_token")
        return access_token, refresh_token


class Chrome:
    def __init__(self):
        self.options = Options()
        # 불필요한 에러 메시지 삭제
        self.options.add_experimental_option("excludeSwitches", ["enable-logging"])

        # 브라우저 창의 크기 지정
        self.options.add_argument("--window-size=1920,1080")
        self.options.add_argument("--disable-dev-shm-usage")
        self.options.add_argument("--no-sandbox")
        self.options.add_argument("--disable-extensions")
        self.options.add_argument("--disable-infobars")
        self.options.add_argument("--disable-notifications")
        self.options.add_argument("--disable-features=VizDisplayCompositor")
        self.options.add_argument("--disable-software-rasterizer")

        # 백그라운드로 실행
        self.options.add_argument("--headless")

        # gpu 미사용
        self.options.add_argument("--disable-gpu")

        # # user_agent 설정
        # self.options.add_argument(
        #     "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        # )

        # 크롬 드라이버 최신 버전 설정
        chrome_driver_manager = (
            settings.CHROME_DRIVER
            if settings.CHROME_DRIVER is not None
            else ChromeDriverManager().install()
        )
        print(f"settings.CHROME_DRIVER:{settings.CHROME_DRIVER}")
        self.service = Service(executable_path=chrome_driver_manager)

        # 웹드라이버 생성
        self.driver = webdriver.Chrome(service=self.service, options=self.options)

        # stealth 라이브러리 사용
        stealth(
            self.driver,
            languages=["ko-KR", "ko", "en-US", "en"],
            vendor="Google Inc.",
            platform="Win64",
            webgl_vendor="Intel Inc.",
            renderer="Intel Iris OpenGL Engine",
            fix_hairline=True,
        )

        # Wait 생성
        self.wait = WebDriverWait(self.driver, 15)
        self.short_wait = WebDriverWait(self.driver, 3)


# Element 찾는 함수
def find_visible(wait: WebDriverWait, css_selector: str) -> WebDriverWait:
    return wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, css_selector)))


def finds_visible(driver: webdriver, wait: WebDriverWait, css_selector: str):
    find_visible(wait, css_selector)
    return driver.find_elements(By.CSS_SELECTOR, css_selector)


def find_present(wait: WebDriverWait, css_selector: str) -> WebDriverWait:
    return wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, css_selector)))


def finds_present(driver: webdriver, wait: WebDriverWait, css_selector: str):
    find_present(wait, css_selector)
    return driver.find_elements(By.CSS_SELECTOR, css_selector)


def find_visible_x(wait: WebDriverWait, xpath: str) -> WebDriverWait:
    return wait.until(EC.visibility_of_element_located((By.XPATH, xpath)))


def finds_visible_x(driver: webdriver, wait: WebDriverWait, xpath: str):
    find_visible_x(wait, xpath)
    return driver.find_elements(By.XPATH, xpath)


def click_skill_btn(wait, input_skill_tag, skill):
    input_skill_tag.send_keys(skill)
    try:
        search_skill_result = find_visible(
            wait, "div[class*=SkillsSearch_SkillsSearch__] ul"
        )
        search_skill_result.click()
        return True
    except:
        return False
