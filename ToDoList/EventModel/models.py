from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField(max_length=100, default='default')
    phone = models.CharField(max_length=11, default='')

    class Meta:
        verbose_name = 'User Profile'

    def __str__(self):
        return self.user.__str__()


class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start = models.DateTimeField(default=now, db_index=True)
    end = models.DateTimeField(default=now)
    priority = models.PositiveIntegerField(default=0)
    repeat = models.PositiveIntegerField(default=0)
    status = models.PositiveIntegerField(default=0)
    content = models.CharField(max_length=500, default='event')
    date = models.DateField(default=now, db_index=True)


class EventSum(models.Model):
    date = models.DateField(default=now, db_index=True)
    value = models.PositiveIntegerField(default=1)


class TimeLine(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hour = models.PositiveIntegerField(default=10)
    content = models.CharField(max_length=500, default='event')
    date = models.DateField(default=now, db_index=True)
