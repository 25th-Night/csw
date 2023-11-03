from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = "home/index.html"

    def get(self, request, *args, **kwargs):
        kwargs["login"] = request.COOKIES.get("access")
        return super().get(request, *args, **kwargs)
