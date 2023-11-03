from django.shortcuts import redirect
from django.views.generic import TemplateView


class LoginView(TemplateView):
    template_name = "user/login.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("index")
        return super().get(request, *args, **kwargs)
