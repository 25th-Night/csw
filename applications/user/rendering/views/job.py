from urllib.parse import urlencode
from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic import TemplateView

import requests

from common.permissions import LoginRequired
from common.data import JOB_LICENSE


class JobView(LoginRequired, TemplateView):
    template_name = "job/index.html"

    def get(self, request, *args, **kwargs):
        user = request.user
        daily_crawling_limit = JOB_LICENSE.get(user.job.license).get(
            "daily_crawling_limit"
        )
        kwargs["daily_crawling_limit"] = daily_crawling_limit
        return super().get(request, *args, **kwargs)
