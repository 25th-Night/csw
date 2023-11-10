# Generated by Django 4.2.6 on 2023-11-09 17:05

from django.db import migrations, models
import url.models


class Migration(migrations.Migration):
    dependencies = [
        ("url", "0004_alter_shortenedurl_expired_at_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="shortenedurl",
            name="access_code",
            field=models.CharField(
                default=url.models.ShortenedUrl.init_access_code,
                max_length=4,
                verbose_name="접속 코드",
            ),
        ),
    ]