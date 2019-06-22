from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def hour(x):
    if x > 12:
        return x - 12
    else:
        return x
