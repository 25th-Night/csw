from rest_framework import serializers
from common.utils import (
    get_user_id_from_cookie,
    make_shortened_url_and_prefix,
)

from url.models import ShortenedUrl


class ShortenedUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedUrl
        exclude = (
            "is_active",
            "updated_at",
        )
        read_only_fields = (
            "prefix",
            "creator_id",
            "click",
            "shortened_url",
            "last_clicked",
            "created_at",
        )

    def create(self, validated_data):
        request = self.context["request"]
        creator_id = get_user_id_from_cookie(request)
        prefix, shortened_url = make_shortened_url_and_prefix()
        validated_data["prefix"] = prefix
        validated_data["creator_id"] = creator_id
        validated_data["shortened_url"] = shortened_url
        instance = super().create(validated_data)

        return instance
