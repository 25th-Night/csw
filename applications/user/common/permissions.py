from django.contrib.auth.mixins import AccessMixin
from django.shortcuts import redirect


class LoginRequired(AccessMixin):
    def dispatch(self, request, *args, **kwargs):
        access = request.COOKIES.get("access")
        if not access:
            return redirect("login")
        return super().dispatch(request, *args, **kwargs)
