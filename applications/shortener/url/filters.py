from django_filters import rest_framework as filters

from url.models import ShortenedUrl


class ShortenedUrlFilter(filters.FilterSet):
    target_url = filters.CharFilter(field_name="target_url", lookup_expr="icontains")
    shortened_url = filters.CharFilter(
        field_name="shortened_url", lookup_expr="icontains"
    )
    nick_name = filters.CharFilter(field_name="nick_name", lookup_expr="icontains")
    access = filters.NumberFilter(field_name="access", lookup_expr="exact")

    class Meta:
        model = ShortenedUrl
        fields = [
            "target_url",
            "nick_name",
            "shortened_url",
            "access",
        ]
