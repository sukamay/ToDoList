from rest_framework import serializers
from .models import UserProfile, Event, TimeLine


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('user', 'start', 'end', 'priority', 'repeat', 'status', 'content', 'id')


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('username')


class TimeLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeLine
        fields = ('user', 'date', 'content', 'hour')
