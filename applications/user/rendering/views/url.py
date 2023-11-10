from urllib.parse import urlencode
from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic import TemplateView

import requests

from common.permissions import LoginRequired
from common.data import LICENSE


class UrlView(LoginRequired, TemplateView):
    template_name = "url/index.html"

    def get(self, request, *args, **kwargs):
        user = request.user
        available_url_cnt = LICENSE.get(user.url.license).get("max_link_cnt")
        kwargs["available_url_cnt"] = available_url_cnt
        return super().get(request, *args, **kwargs)


class PrivateUrlView(TemplateView):
    template_name = "url/permission/private.html"

    def get(self, request, *args, **kwargs):
        prefix = self.request.GET.get("prefix")
        url = self.request.GET.get("url")
        url_path = f"/{prefix}/{url}"

        kwargs["url_path"] = url_path

        get_url = f"{settings.REQUEST_URL_DOMAIN}/shortener{url_path}"
        response = requests.get(get_url, verify=False)
        if response.status_code == 200:
            response_url = response.json()
            if response_url.get("access") == 1:
                target_url = response_url.get("target_url")
                if not target_url.startswith("https://") and not target_url.startswith(
                    "http://"
                ):
                    target_url = "https://" + target_url
                return redirect(target_url)

            elif response_url.get("access") == 3:
                secret_url = reverse("url_secret")
                query_params = {"prefix": prefix, "url": url}
                url_with_query = f"{secret_url}?{urlencode(query_params)}"
                return redirect(url_with_query)
            if request.user and request.user.id != response_url.get("creator_id"):
                response_url.pop("access_code")
            kwargs["url"] = response_url
        else:
            kwargs["msg"] = "Url not found"

        return super().get(request, *args, **kwargs)


class SecretUrlView(TemplateView):
    template_name = "url/permission/secret.html"

    def get(self, request, *args, **kwargs):
        prefix = self.request.GET.get("prefix")
        url = self.request.GET.get("url")
        url_path = f"/{prefix}/{url}"

        kwargs["url_path"] = url_path

        get_url = f"{settings.REQUEST_URL_DOMAIN}/shortener{url_path}"
        response = requests.get(get_url, verify=False)
        if response.status_code == 200:
            response_url = response.json()
            if response_url.get("access") == 1:
                target_url = response_url.get("target_url")
                if not target_url.startswith("https://") and not target_url.startswith(
                    "http://"
                ):
                    target_url = "https://" + target_url
                return redirect(target_url)

            elif response_url.get("access") == 2:
                private_url = reverse("url_private")
                query_params = {"prefix": prefix, "url": url}
                url_with_query = f"{private_url}?{urlencode(query_params)}"
                return redirect(url_with_query)
            kwargs["url"] = response_url
        else:
            kwargs["msg"] = "Url not found"

        return super().get(request, *args, **kwargs)
