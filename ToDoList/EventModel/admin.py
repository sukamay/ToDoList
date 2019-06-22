from django.contrib import admin
from . import models
from EventModel.models import Event, UserProfile, User, TimeLine

# Register your models here.
admin.site.register([Event, UserProfile, TimeLine])
# username : admin
# password: admin123
