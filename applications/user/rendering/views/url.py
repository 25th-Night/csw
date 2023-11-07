from django.views.generic import TemplateView


from common.permissions import LoginRequired
from common.data import LICENSE


class UrlView(LoginRequired, TemplateView):
    template_name = "url/index.html"

    def get(self, request, *args, **kwargs):
        user = request.user
        available_url_cnt = LICENSE.get(user.url.license).get("max_link_cnt")
        kwargs["available_url_cnt"] = available_url_cnt
        return super().get(request, *args, **kwargs)
