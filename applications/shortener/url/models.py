from django.db import models

from common.models import CommonModel


class ShortenedUrl(CommonModel):
    nick_name = models.CharField(max_length=30)
    prefix = models.CharField(max_length=50)
    creator_id = models.IntegerField()
    target_url = models.CharField(max_length=1000)
    click = models.BigIntegerField(default=0)
    shortened_url = models.CharField(max_length=6)
    last_clicked = models.DateTimeField(null=True)
    expired_at = models.DateField(null=True)

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "prefix",
                    "shortened_url",
                ]
            ),
        ]

    def clicked(self):
        self.click += 1
        self.save()
        return self
