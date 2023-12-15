from datetime import date, datetime


from django.core.validators import MinValueValidator, MaxValueValidator

from rest_framework import serializers

from common.utils import (
    make_prefix,
    make_shortened_url,
    make_shortened_url_and_prefix,
)

from url.models import ShortenedUrl


class ShortenedUrlSerializer(serializers.ModelSerializer):
    nick_name = serializers.CharField(
        max_length=30,
        required=False,
        allow_null=True,
        allow_blank=True,
        default="Undefined",
    )
    expired_at = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    access = serializers.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(3)]
    )

    prefix = serializers.CharField(
        max_length=30,
        required=False,
        allow_null=True,
        allow_blank=True,
    )

    shortened_url = serializers.CharField(
        max_length=30,
        required=False,
        allow_null=True,
        allow_blank=True,
    )

    class Meta:
        model = ShortenedUrl
        exclude = (
            "is_active",
            "updated_at",
        )
        read_only_fields = (
            "click",
            "last_clicked",
            "created_at",
        )

    def create(self, validated_data):
        nick_name = validated_data.get("nick_name", "Undefined")
        prefix = validated_data.get("prefix", make_prefix())
        shortened_url = validated_data.get("shortened_url", make_shortened_url())

        validated_data["nick_name"] = nick_name
        validated_data["prefix"] = prefix
        validated_data["shortened_url"] = shortened_url

        instance = super().create(validated_data)
        return instance

    def update(self, instance, validated_data):
        expired_at = validated_data.get("expired_at")
        if not expired_at:
            validated_data["expired_at"] = None
        return super().update(instance, validated_data)

    def validate_expired_at(self, value):
        message = "Cannot select a date earlier than today"
        print(f"expire_at value:{value}")
        if value:
            date_format = "%Y-%m-%d"
            input_date = datetime.strptime(value, date_format).date()
            if input_date < date.today():
                raise serializers.ValidationError(message)
        return value


class SimpleShortenedUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedUrl
        fields = (
            "creator_id",
            "access",
            "prefix",
            "shortened_url",
            "access_code",
            "target_url",
        )
