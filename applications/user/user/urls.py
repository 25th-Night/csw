from django.urls import path

from user.views import (
    AuthView,
    PasswordCorrectView,
    EmailExistView,
    PasswordFormatView,
    PhoneCheckView,
    SignUpView,
)


urlpatterns = [
    path("signup", SignUpView.as_view(), name="signup"),
    path("auth", AuthView.as_view(), name="auth"),
    path("exist_email", EmailExistView.as_view(), name="exist_email"),
    path("check_phone", PhoneCheckView.as_view(), name="check_phone"),
    path("correct_pw", PasswordCorrectView.as_view(), name="correct_pw"),
    path("format_pw", PasswordFormatView.as_view(), name="format_pw"),
]
