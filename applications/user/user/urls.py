from django.urls import path, include

from user.views import AuthView, CheckPasswordView, CheckEmailView, SignUpView


urlpatterns = [
    path("signup", SignUpView.as_view(), name="signup"),
    path("auth", AuthView.as_view(), name="auth"),
    path("check_email", CheckEmailView.as_view(), name="check_email"),
    path("check_pw", CheckPasswordView.as_view(), name="check_pw"),
]
