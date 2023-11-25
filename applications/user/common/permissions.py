from django.contrib.auth.mixins import AccessMixin
from django.shortcuts import redirect
from django.urls import reverse


class LoginRequired(AccessMixin):
    def dispatch(self, request, *args, **kwargs):
        print(f"request.path:{request.path}")
        if (
            not hasattr(request.user, "is_authenticated")
            or not request.user.is_authenticated
        ):
            if request.path == reverse("login"):
                return redirect("login")
            else:
                redirect_url = f"/login/?next={request.path}"
                return redirect(redirect_url)

        return super().dispatch(request, *args, **kwargs)
