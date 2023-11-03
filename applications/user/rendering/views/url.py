from django.views.generic import TemplateView


class UrlView(TemplateView):
    template_name = "url/index.html"

    def get(self, request, *args, **kwargs):
        kwargs["login"] = request.COOKIES.get("access")
        return super().get(request, *args, **kwargs)
