# -*- coding: utf-8 -*-
# send the email
import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr
from .models import Event
from datetime import date, datetime, timedelta


def send_email(email_content):
    print('this is a test')
    email_content = '今日待办：<ul>'
    sender = '253246887@qq.com'
    password = 'ojqntywmxoxkbhde'   # qq 授权码
    events = Event.objects.filter(date=date.today())
    for event in events:
        email_content += '<li>' + event.content + '</li></ul>'
    receiver = '253246887@qq.com'
    try:
        msg = MIMEText(email_content, 'html', 'utf-8')
        msg['From'] = formataddr(["updateNote", sender])  # 括号里的对应发件人邮箱昵称、发件人邮箱账号
        msg['To'] = formataddr(["FK", receiver])  # 括号里的对应收件人邮箱昵称、收件人邮箱账号
        msg['Subject'] = "Todo提醒"  # 邮件的主题，也可以说是标题

        server = smtplib.SMTP_SSL("smtp.qq.com", 465)  # 发件人邮箱中的SMTP服务器，端口是25
        server.login(sender, password)  # 括号中对应的是发件人邮箱账号、邮箱密码
        server.sendmail(sender, [receiver, ], msg.as_string())  # 括号中对应的是发件人邮箱账号、收件人邮箱账号、发送邮件
        server.quit()  # 关闭连接
    except Exception:
        print('fail to send email')


