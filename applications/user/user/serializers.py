import re

from rest_framework import serializers

from user.models import User


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "fullname",
            "password",
        )

    def validate_email(self, value):
        message = "이미 사용 중인 이메일입니다."
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(message)
        return value

    def validate_fullname(self, value):
        match = "^(?=.*[A-Za-z])[A-Za-z](?:[A-Za-z\s]{0,1}[A-Za-z]){3,}$|^[가-힣]{2,}$"
        message = "2자 이상의 한글 혹은 5자 이상의 영문으로 작성해주세요.\n영문의 경우, 중간에 최대 1개의 공백을 허용합니다."
        validation = re.compile(match)
        if validation.match(value) is None:
            raise serializers.ValidationError(message)
        return value

    def validate_phone(self, value):
        match = "^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$"
        message = "정확한 휴대전화 번호를 입력해주세요"
        validation = re.compile(match)
        if validation.match(value) is None:
            raise serializers.ValidationError(message)
        return value

    def validate_password(self, value):
        match = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
        message = "비밀번호는 하나 이상의 문자, 숫자, 특수문자를 포함하여 8자리 이상으로 작성해주세요."
        validation = re.compile(match)
        if validation.match(value) is None:
            raise serializers.ValidationError(message)
        return value

    def create(self, validated_data):
        email = validated_data.get("email")
        fullname = validated_data.get("fullname")
        phone = validated_data.get("phone")
        password = validated_data.get("password")

        user = User.objects.create(email=email, fullname=fullname, phone=phone)
        user.set_password(password)
        user.save()

        return user
