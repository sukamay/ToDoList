# -*- coding: utf-8 -*-
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from .models import UserProfile
from captcha.fields import CaptchaField


class RegisterForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = UserProfile
        fields = ('username', 'email', 'phone', 'password')

    # check if email is valid
    def clean_email(self):
        email = self.cleaned_data['email']
        users = UserProfile.objects.filter(email=email)
        if users:
            raise forms.ValidationError("该邮箱已注册过，尝试登录？")
        return email


class ChangeInfoForm(UserChangeForm):

    class Meta(UserChangeForm.Meta):
        model = UserProfile
        fields = ('username', 'email', 'phone')


class LogInForm(forms.Form):
    username = forms.CharField(label="用户名", max_length=300,
                               widget=forms.TextInput(attrs={'class':'form-control'}))
    password = forms.CharField(label="密码", max_length=300,
                               widget=forms.TextInput(attrs={'class': 'form-control'}))
    captcha = CaptchaField(label="验证码")
