from django.urls import path

from user.views import AuthView, SignUpView


urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("auth/", AuthView.as_view(), name="auth"),
]
