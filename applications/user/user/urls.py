from django.urls import path

from user.views import (
    AuthView,
    TokenRefreshView,
    PasswordCorrectView,
    EmailExistView,
    PasswordFormatView,
    PhoneCheckView,
    SignUpView,
    UpdateTotalUrlCountView,
)


urlpatterns = [
    path("signup", SignUpView.as_view(), name="signup"),
    path("auth", AuthView.as_view(), name="auth"),
    path("refresh", TokenRefreshView.as_view(), name="refresh"),
    path("exist_email", EmailExistView.as_view(), name="exist_email"),
    path("check_phone", PhoneCheckView.as_view(), name="check_phone"),
    path("correct_pw", PasswordCorrectView.as_view(), name="correct_pw"),
    path("format_pw", PasswordFormatView.as_view(), name="format_pw"),
    path("url", UpdateTotalUrlCountView.as_view(), name="update_url"),
]
