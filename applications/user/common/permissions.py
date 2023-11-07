from django.contrib.auth.mixins import AccessMixin
from django.shortcuts import redirect


class LoginRequired(AccessMixin):
    def dispatch(self, request, *args, **kwargs):
        if (
            not hasattr(request.user, "is_authenticated")
            or not request.user.is_authenticated
        ):
            return redirect("login")

        return super().dispatch(request, *args, **kwargs)
