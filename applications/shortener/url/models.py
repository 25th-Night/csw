from django.db import models
from django.utils import timezone

import random
import string

from common.models import CommonModel


class ShortenedUrl(CommonModel):
    class Access(models.IntegerChoices):
        PUBLIC = 1
        PRIVATE = 2
        SECRET = 3

    def init_access_code():
        str_pool = string.digits + string.ascii_letters
        return "".join([random.choice(str_pool) for _ in range(4)])

    nick_name = models.CharField(
        verbose_name="별칭", max_length=30, blank=True, default="Undefined"
    )
    prefix = models.CharField(verbose_name="접두사", max_length=50)
    creator_id = models.IntegerField(verbose_name="생성자 ID")
    target_url = models.CharField(verbose_name="대상 URL", max_length=1000)
    click = models.BigIntegerField(verbose_name="클릭 수", default=0)
    shortened_url = models.CharField(verbose_name="단축 url", max_length=6)
    last_clicked = models.DateTimeField(verbose_name="마지막 클릭 일시", null=True)
    expired_at = models.DateField(verbose_name="만료일", blank=True, null=True)
    access = models.IntegerField(
        verbose_name="공개범위", choices=Access.choices, default=Access.PUBLIC
    )
    access_code = models.CharField(
        verbose_name="접속 코드", max_length=4, default=init_access_code
    )

    class Meta:
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(
                fields=[
                    "prefix",
                    "shortened_url",
                ]
            ),
        ]
        ordering = ["-created_at"]

    def clicked(self):
        self.click += 1
        self.last_clicked = timezone.now()
        self.save()
        return self

    def __str__(self):
        return f"{self.target_url}의 단축 url"
