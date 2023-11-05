from django.shortcuts import redirect
from django.views.generic import TemplateView


class LoginView(TemplateView):
    template_name = "user/login.html"

    def get(self, request, *args, **kwargs):
        kwargs["login"] = request.COOKIES.get("access")
        if kwargs["login"]:
            return redirect("index")
        return super().get(request, *args, **kwargs)
