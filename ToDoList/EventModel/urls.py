from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from django.views.static import serve
from django.conf import settings
from . import views
from django.conf.urls.static import static
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
# import haystack


urlpatterns = format_suffix_patterns([
    path('mday/', login_required(views.MDayList.as_view())),
    path('day/', login_required(views.DayList.as_view())),
    path('month/', login_required(views.MonthList.as_view())),
    path('year/', login_required(views.YearList.as_view())),
    path('user/', views.UserList.as_view()),
    path('accounts/login/', views.LogIn.as_view()),
    path('accounts/register/', views.Register.as_view()),
    path('api/events/year/', login_required(views.EventYearList.as_view())),
    path('api/events/month/', login_required(views.EventMonthList.as_view())),
    path('api/events/weekSum/', login_required(views.EventWeekSumList.as_view())),
    path('event/list/', login_required(views.EventList.as_view())),
    path('event/mod/', login_required(views.EventMod.as_view())),
    path('event/del/', login_required(views.EventDel.as_view())),
    path('event/toggleAll/', login_required(views.EventToggleAll.as_view())),
    path('captcha', include('captcha.urls')),
    path('send_message/', views.send_message),
    # path('accounts/logout/', LogoutView.as_view()),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))
