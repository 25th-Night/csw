from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)

from common.models import CommonModel


class UserManager(BaseUserManager):
    def create_user(self, email, password, phone, license, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")
        if not password:
            raise ValueError("Users must have a password")
        email = self.normalize_email(email)
        user = self.model(email=email, phone=phone)
        user.set_password(password)
        user.save(using=self._db)

        url = Url.objects.create(user=user)

        return user

    def create_superuser(self, email, password, phone, **kwargs):
        superuser = self.create_user(email=email, password=password, phone=phone)
        superuser.is_admin = True
        superuser.is_superuser = True
        superuser.save(using=self._db)

        url = superuser.url.license = Url.License.MASTER
        url.save()

        return superuser


class User(CommonModel, AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name="이메일", max_length=100, unique=True)
    fullname = models.CharField(verbose_name="이름", max_length=30)
    phone = models.CharField(verbose_name="휴대폰번호", max_length=30, unique=True)
    password = models.CharField(verbose_name="비밀번호", max_length=100)
    is_admin = models.BooleanField(verbose_name="관리자여부", default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["password", "phone"]

    objects: UserManager = UserManager()

    class Meta:
        verbose_name = "사용자"
        verbose_name_plural = "사용자 목록"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
        ]

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin


class Url(CommonModel):
    class License(models.IntegerChoices):
        FREE = 1
        BASIC = 2
        PREMIUM = 3
        MASTER = 4

    user = models.OneToOneField(
        User, verbose_name="사용자", related_name="url", on_delete=models.CASCADE
    )
    license = models.IntegerField(
        verbose_name="라이선스", choices=License.choices, default=License.FREE
    )
    total_cnt = models.IntegerField(verbose_name="사용 중인 총 URL 수", default=0)

    def __str__(self):
        return f"{self.user}의 라이선스 : {self.get_license_display()}"
