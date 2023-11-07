from datetime import date


from django.core.validators import MinValueValidator, MaxValueValidator

from rest_framework import serializers

from common.utils import (
    make_shortened_url_and_prefix,
)

from url.models import ShortenedUrl


class ShortenedUrlSerializer(serializers.ModelSerializer):
    nick_name = serializers.CharField(
        max_length=30,
        required=False,
        allow_null=True,
        allow_blank=True,
        default="Unknown",
    )
    expired_at = serializers.DateField(
        required=False,
        allow_null=True,
        validators=[MinValueValidator(limit_value=date.today())],
    )

    access = serializers.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(3)]
    )

    class Meta:
        model = ShortenedUrl
        exclude = (
            "is_active",
            "updated_at",
        )
        read_only_fields = (
            "prefix",
            "click",
            "shortened_url",
            "last_clicked",
            "created_at",
        )

    def create(self, validated_data):
        prefix, shortened_url = make_shortened_url_and_prefix()
        validated_data["prefix"] = prefix
        validated_data["shortened_url"] = shortened_url
        nick_name = validated_data.get("nick_name")
        if not nick_name:
            validated_data.pop("nick_name")
        instance = super().create(validated_data)
        return instance

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
