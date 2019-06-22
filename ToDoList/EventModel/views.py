# -*- coding: utf-8 -*-
from django.shortcuts import render
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserProfile, Event, User, TimeLine
from .serialiers import UserProfileSerializer, EventSerializer, TimeLineSerializer
import json
import math
import os
from rest_framework import serializers
from rest_framework.parsers import JSONParser
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from django.contrib import auth
from datetime import date, datetime, timedelta
import time
from .filters import EventDateFilter
from django_filters import rest_framework as filters
from rest_framework.permissions import IsAdminUser
from .utils import *
import urllib
import random
import http


class MDayList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'mday.html'

    def get(self, request):
        start_date = date.today()
        end_date = start_date + timedelta(days=-364)
        dataset = Event.objects.filter(Q(start__range=(end_date, start_date + timedelta(days=1)))
                                       & Q(user=request.user))
        item_set = dataset.filter(date=start_date)
        item_list = EventSerializer(item_set, many=True).data
        # username = User.objects.filter(id=request.user).value('username')
        time_line_set = TimeLine.objects.filter(date=start_date).order_by('hour')
        time_line_list = []
        hour = 7
        for time in time_line_set:
            if time.hour != hour:
                i = hour
                for i in range(hour, time.hour):
                    time_line_list.append({'hour': i})
                hour = i + 1
                time_line_list.append({'hour': hour, 'content': time.content})
                hour += 1
        for i in range(hour + 1, 22):
            time_line_list.append({'hour': i})

        # time_line_list = TimeLineSerializer(time_line_set, many=True).data
        time_line_list_final = [{'hour': 10, 'content': 'event'}]
        return Response({'item_list': item_list, 'event_sum': dataset.count(),
                         'time_line': time_line_list})


class DayList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'day.html'

    def get(self, request):
        start_date = date.today()
        end_date = start_date + timedelta(days=-364)
        dataset = Event.objects.filter(Q(start__range=(end_date, start_date + timedelta(days=1)))
                                       & Q(user=request.user))
        item_set = dataset.filter(date=start_date)
        item_list = EventSerializer(item_set, many=True).data
        # username = User.objects.filter(id=request.user).value('username')
        time_line_set = TimeLine.objects.filter(date=start_date).order_by('hour')
        time_line_list = []
        hour = 7
        for time in time_line_set:
            if time.hour != hour:
                i = hour
                for i in range(hour, time.hour):
                    time_line_list.append({'hour': i})
                hour = i + 1
                time_line_list.append({'hour': hour, 'content': time.content})
                hour += 1
        for i in range(hour+1, 22):
            time_line_list.append({'hour': i})

        # time_line_list = TimeLineSerializer(time_line_set, many=True).data
        time_line_list_final = [{'hour': 10, 'content': 'event'}]
        return Response({'item_list': item_list, 'event_sum': dataset.count(), 'username': request.user,
                         'time_line': time_line_list, 'type': 'day'})


class MonthList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'month.html'

    def get(self, request):
        return Response({'type': 'month'})


class YearList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'year.html'

    def get(self, request):
        return Response({'type': 'year'})


class EventYearList(APIView):
    def get(self, request):
        start_date = date.today() + timedelta(days=1)
        end_date = start_date + timedelta(days=-364)
        dataset = Event.objects.values_list('date').annotate(Count('id')).\
            filter(Q(start__range=(end_date, start_date)) & Q(user=request.user))
        heat_map_data = []
        for data in dataset:
            heat_map_data.append({'date': time.mktime(data[0].timetuple()), 'value': data[1]})
        return JsonResponse({'data': heat_map_data})


class EventMonthList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = (filters.DjangoFilterBackend, )
    filter_class = EventDateFilter
    permission_classes = (IsAdminUser, )


class EventWeekSumList(APIView):
    def get(self, request):
        now = date.today()
        last_monday = now + timedelta(days=-(now.weekday()))
        sunday = now + timedelta(days=(6-now.weekday()))

        done_set = Event.objects.values_list('date').annotate(num=Count('id')).\
            filter(Q(date__range=(last_monday, now)) & Q(status=1) & Q(user=request.user))
        todo_set = Event.objects.values_list('date').annotate(num=Count('id')).\
            filter(Q(date__range=(last_monday, sunday)) & Q(status=0) & Q(user=request.user))
        todo_data = []
        done_data = []
        for i in range(-now.weekday(), 1):
            day = now + timedelta(days=i)
            if done_set.filter(date=day).count() > 0:
                done_data.append(done_set.filter(date=day)[0][1])
            else:
                done_data.append(0)
        for i in range(-now.weekday(), 7-now.weekday()):
            day = now + timedelta(days=i)
            if todo_set.filter(date=day).count() > 0:
                todo_data.append(todo_set.filter(date=day)[0][1])
            else:
                todo_data.append(0)
        # done_data = [entry[1] for entry in done_set]
        # todo_data = [entry[1] for entry in todo_set]
        return JsonResponse({'todo_data': todo_data, 'done_data': done_data})


class EventList(APIView):
    # queryset = Event.objects.all()
    # serializer_class = EventSerializer
    def get(self, request):
        msg = 'ok'
        return JsonResponse({'msg': msg}, status=status.HTTP_200_OK)

    def post(self, request):
        content = request.POST.get('content', None)
        if not content:
            msg = 'the content of event should not be empty'
            return JsonResponse({'msg': msg}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        start = request.POST.get('start', None)
        end = request.POST.get('end', None)
        priority = request.POST.get('priority', 0)
        repeat = request.POST.get('repeat', 0)
        event_status = request.POST.get('status', 0)

        if not start:
            start = datetime.now()
            end = start
        else:
            start = math.ceil(float(start))
            start = datetime.fromtimestamp(start)
            if end:
                end = math.ceil(float(end))
                end = datetime.fromtimestamp(end)
            else:
                end = start
        date = start.date()
        event = Event(user=user, start=start, end=end, content=content, priority=priority,
                      repeat=repeat, status=event_status)
        event.save()
        msg = 'ok'
        return JsonResponse({'msg': msg, 'id': event.id})


class EventMod(APIView):

    def post(self, request):
        item_id = request.POST.get('id', None)
        msg = 'ok'
        if item_id:
            item = get_object_or_404(Event, id=item_id)
            item_status = request.POST.get('status', None)
            item_start = request.POST.get('start', None)
            item_end = request.POST.get('end', None)
            item_priority = request.POST.get('priority', None)
            item_content = request.POST.get('content', None)
            if item_start:
                item_start = math.ceil(float(item_start))
            if item_end:
                item_end = math.ceil(float(item_end))
            if (item_start is not None) & (item_end is not None):
                if item_end < item_start:
                    msg = '结束时间应大于等于开始时间！'
                    return JsonResponse({'msg': msg}, status=status.HTTP_400_BAD_REQUEST)
                item.start = datetime.fromtimestamp(item_start)
                item.end = datetime.fromtimestamp(item_end)
            if item_status:
                item_status = math.ceil(float(item_status))
                if item_status < 0 | item_status > STATUS_NUM:
                    msg = '非法的事件完成状态'
                    return JsonResponse({'msg': msg}, status=status.HTTP_400_BAD_REQUEST)
                item.status = item_status
            if item_content:
                item.content = item_content
            if item_priority:
                item_priority = math.ceil(float(item_priority))
                if item_priority < 0 | item_priority > PRIORITY_NUM:
                    msg = '非法的事件优先级'
                    return JsonResponse({'msg': msg}, status=status.HTTP_400_BAD_REQUEST)
                item.priority = item_priority
            item.save()
            item_data = EventSerializer(item).data
        return JsonResponse({'msg': msg, 'id': item_id, 'data': item_data}, status=status.HTTP_200_OK)


class EventDel(APIView):

    def post(self, request):
        id = request.POST.get('id', None)
        if id:
            item = get_object_or_404(Event, id=id)
            item.delete()
        return JsonResponse({'msg': 'success to delete the event'})


class EventToggleAll(APIView):
    def post(self, request):
        id = request.POST.get('id', None)
        if id:
            items_id = id.split('/')
            for item_id in items_id:
                item = Event.objects.get(id=item_id)
                item.status = 1 - item.status
                item.save()
        return JsonResponse({'msg': 'toggle all'})


class EventClearAll(APIView):
    def post(self, request):
        id = request.POST.get('id', None)
        if id:
            items_id = id.split('/')
            for item_id in items_id:
                item = Event.objects.get(id=item_id)
                item.delete()
        return JsonResponse({'mg': 'clear all'})


class UserList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'empty.html'

    def get(self, request, format=None):
        queryset = UserProfile.objects.all()
        serializer = UserProfileSerializer(queryset, many=True)
        return Response({'data': serializer.data})

    def post(self, request, format=None):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data, 'status': status.HTTP_201_CREATED})
        return Response({'data': serializer.data, 'status': status.HTTP_400_BAD_REQUEST})


class LogIn(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'login.html'

    def get(self, request):
        return Response({})

    def post(self, request):
        if request.session.get('is_login', None):
            return HttpResponseRedirect('/todo/day/')
        mobile = request.POST.get('mobile', '')
        code = request.POST.get('code', '')
        if mobile:
            if code & code == request.session['message_code']:
                # user_profile = UserProfile.objects.get(phone=mobile)
                # if user_profile:
                #     user = User.objects.get(id=user_profile.user_id)
                #     if user:
                #         auth.login(request, user)

                # else:
                #     message = '该手机号未注册，注册？'
                #     return Response({'message': message})
                user = User.objects.get_or_create(username=mobile)
                auth.login(request, user)
                return HttpResponseRedirect('/todo/day/')
            else:
                message = '验证码错误'
        else:
            message = '手机号无效'
        # username = request.POST.get('username', '')
        # password = request.POST.get('password', '')
        # user = auth.authenticate(username=username, password=password)
        # if user is not None and user.is_active:
        #     auth.login(request, user)
        #     request.session['is_login'] = True
        #     request.session['user_id'] = user.id
        #     request.session['user_name'] = user.username
        #     return HttpResponseRedirect('/todo/day/')
        # # return HttpResponseRedirect('/todo/accounts/login/')
        return Response({'message': message})


class LogOut(APIView):
    def post(self, request):
        auth.logout(request)
        if not request.session.get('is_login', None):
            return HttpResponseRedirect('/todo/accounts/login/')
        request.session.flush()
        return HttpResponseRedirect('/todo/accounts/login/')


class Register(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'register.html'

    def get(self, request):
        return Response()

    def post(self, request):
        login_type = request.POST.get('type', '')
        if login_type == 'mobile':
            code = request.POST.get('code', '')
            mobile = request.POST.get('mobile', '')

        code = request.POST.get('code', '')
        if code & code != request.session['message_code']:
            message = '手机验证码错误，请重新尝试'
            return Response({'message': message})
        mobile = request.POST.get('mobile', '')
        if mobile:
            username = mobile
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        same_user = User.objects.filter(username=username)
        if same_user:
            message = '用户名已存在'
            return Response({'message': message})
        new_user = User.objects.create_user(username=username, password=password)
        new_user.save()
        new_user_profile = UserProfile.objects.create(user_id=new_user.id, phone=mobile)
        new_user_profile.save()
        return HttpResponseRedirect('/todo/accounts/login/')


def login_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        auth.login(request, user)
        return HttpResponseRedirect('/accounts/loggedin/')
    return HttpResponseRedirect('/accounts/invalid/')


def logout_view(request):
    auth.logout(request)
    return HttpResponseRedirect('/accounts/loggedout/')


# 请求的路径
host = "106.ihuyi.com"
sms_send_uri = "/webservice/sms.php?method=Submit"
# 用户名是登录ihuyi.com账号名（例如：cf_demo123）
account = "C80074029"
# 密码 查看密码请登录用户中心->验证码、通知短信->帐户及签名设置->APIKEY
password = "21c685adfdacf2d845301f858e677ed7"


def send_message(request):
    """发送信息的视图函数"""
    # 获取ajax的get方法发送过来的手机号码
    mobile = str(request.GET.get('mobile'))
    # 通过手机去查找用户是否已经注册
    # user = User.objects.filter(username=mobile)
    # if len(user) == 1:
    #     return JsonResponse({'msg': "该手机已经注册"})
    # 定义一个字符串,存储生成的6位数验证码
    message_code = ''
    for i in range(6):
        i = random.randint(0, 9)
        message_code += str(i)
    # 拼接成发出的短信
    text = "您的验证码是：" + message_code + "。请不要把验证码泄露给其他人。"
    # 把请求参数编码
    params = urllib.parse.urlencode(
        {'account': account, 'password': password, 'content': text, 'mobile': mobile, 'format': 'json'})
    # 请求头
    headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
    # 通过全局的host去连接服务器
    conn = http.client.HTTPConnection(host, port=80, timeout=30)
    # 向连接后的服务器发送post请求,路径sms_send_uri是全局变量,参数,请求头
    conn.request("POST", sms_send_uri, params, headers)
    # 得到服务器的响应
    response = conn.getresponse()
    # 获取响应的数据
    response_str = response.read()
    # 关闭连接
    conn.close()
    # 把验证码放进session中
    request.session['message_code'] = message_code
    print(eval(response_str.decode()))
    # 使用eval把字符串转为json数据返回
    return JsonResponse(eval(response_str.decode()))
