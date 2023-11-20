import re

from django.contrib.auth.hashers import check_password

from rest_framework import serializers

from user.models import Job, Url, User


class SignUpSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ("id", "email", "fullname", "phone", "password", "password_confirm")

    def validate_email(self, value):
        message = "Already in use."
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(message)
        return value

    def validate_fullname(self, value):
        match = "^(?=.*[A-Za-z])[A-Za-z](?:[A-Za-z\s]{0,1}[A-Za-z]){3,}$|^[가-힣]{2,}$"
        # message = "2자 이상의 한글 혹은 5자 이상의 영문(1칸의 공백 허용)으로 작성해주세요."
        message = (
            "Enter at least '2 chars of Korean' or '5 chars of English(up to 1 space)'."
        )
        validation = re.compile(match)
        if validation.match(value) is None:
            raise serializers.ValidationError(message)
        return value

    def validate_phone(self, value):
        match = "^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$"
        # message = '올바른 형식으로 입력해주세요. (예: 010-1234-1234)'
        message = 'Allowed format : "010-1234-1234"'
        validation = re.compile(match)
        if validation.match(value) is None:
            raise serializers.ValidationError(message)
        return value

    def validate_password(self, value):
        match = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
        # message = "비밀번호는 하나 이상의 문자, 숫자, 특수문자를 포함하여 8자리 이상으로 작성해주세요."
        message = "Enter at least 8 chars with at least 1 letter, 1 number, 1 special char(@$!%*#?&)"
        validation = re.compile(match)
        if validation.match(value) is None:
            raise serializers.ValidationError(message)
        return value

    def validate_password_confirm(self, value):
        match = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
        message = "Enter at least 8 chars with at least 1 letter, 1 number, 1 special char(@$!%*#?&)"
        validation = re.compile(match)
        if validation.match(value) is None:
            raise serializers.ValidationError(message)
        return value

    def validate(self, data):
        # message="비밀번호가 일치하지 않습니다."
        message = "Password not matched."
        if data.get("password") != data.get("password_confirm"):
            raise serializers.ValidationError(message)
        return data

    def create(self, validated_data):
        email = validated_data.get("email")
        fullname = validated_data.get("fullname")
        phone = validated_data.get("phone")
        password = validated_data.get("password")

        user = User.objects.create(email=email, fullname=fullname, phone=phone)
        user.set_password(password)
        user.save()

        Url.objects.create(user=user)
        Job.objects.create(user=user)

        return user


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # message_email = "해당 이메일로 가입된 정보가 존재하지 않습니다."
        # message_password1 = "비밀번호는 하나 이상의 문자, 숫자, 특수문자를 포함하여 8자리 이상으로 작성해주세요."
        # message_password2 = "비밀번호가 일치하지 않습니다."
        message_email = "Not registered Email."
        message_password1 = "Enter at least 8 chars with at least 1 letter, 1 number, 1 special char(@$!%*#?&)"
        message_password2 = "Password not matched."

        errors = {}

        match = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
        validation = re.compile(match)

        user = User.objects.filter(email=email).last()

        if not user:
            errors["email"] = message_email
        elif validation.match(password) is None:
            errors["password"] = message_password1
        elif not check_password(password, user.password):
            errors["password"] = message_password2

        if errors:
            raise serializers.ValidationError(errors)

        return data
