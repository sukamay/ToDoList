from .models import Event
import django_filters


class EventDateFilter(django_filters.FilterSet):
    min_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    max_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = Event
        fields = ['user', 'start', 'end', 'priority', 'repeat', 'status', 'content', 'id']
