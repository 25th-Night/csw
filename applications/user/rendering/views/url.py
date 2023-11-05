from django.views.generic import TemplateView
from common.utils import get_user_url_license
from common.permissions import LoginRequired


class UrlView(LoginRequired, TemplateView):
    template_name = "url/index.html"

    def get(self, request, *args, **kwargs):
        kwargs["login"] = request.COOKIES.get("access")
        kwargs["url_license"] = get_user_url_license(request)
        return super().get(request, *args, **kwargs)
