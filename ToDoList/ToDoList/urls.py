"""ToDoList URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from apscheduler.scheduler import Scheduler
from EventModel.email import send_email

urlpatterns = [
    path('admin/', admin.site.urls),
    path('todo/', include('EventModel.urls')),
]

scheduler = Scheduler()


@scheduler.interval_schedule(seconds=3600)
def my_task():
    send_email('this is a test')


scheduler.start()
