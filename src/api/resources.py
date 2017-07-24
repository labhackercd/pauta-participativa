from django.conf import settings
from django.contrib.auth import get_user_model
from tastypie.resources import ModelResource, ALL_WITH_RELATIONS, ALL
from tastypie import fields
from core import models


class UserResource(ModelResource):

    class Meta:
        queryset = get_user_model().objects.all()
        allowed_methods = ['get']
        filtering = {
            'id': ALL,
            'first_name': ALL,
            'last_name': ALL,
            'username': ALL,
        }
        excludes = ['is_active', 'is_staff', 'is_superuser', 'last_login',
                    'password', 'date_joined']

    def dehydrate(self, bundle):
        key = bundle.request.GET.get('api_key', None)
        if key != settings.API_KEY:
            del bundle.data['email']
        return bundle


class ItemResource(ModelResource):

    class Meta:
        queryset = models.Item.objects.filter(theme__agenda__is_visible=True)
        allowed_methods = ['get']
        filtering = {
            'id': ALL,
            'theme': ALL_WITH_RELATIONS,
            'title': ALL,
            'description': ALL
        }


class ThemeResource(ModelResource):

    items = fields.ToManyField(ItemResource, 'items', full=True, null=True)

    class Meta:
        queryset = models.Theme.objects.filter(agenda__is_visible=True)
        allowed_methods = ['get']
        filtering = {
            'id': ALL,
            'name': ALL,
            'agenda': ALL_WITH_RELATIONS,
        }


class AgendaResource(ModelResource):

    themes = fields.ToManyField(ThemeResource, 'themes', full=True, null=True)

    class Meta:
        queryset = models.Agenda.objects.filter(is_visible=True)
        allowed_methods = ['get']
        excludes = ['is_visible']
        filtering = {
            'inirial_date': ALL,
            'end_date': ALL,
            'meeting_date': ALL,
        }


class VoteResource(ModelResource):

    user = fields.ToOneField(UserResource, 'user', full=True, null=True)
    item = fields.ToOneField(ItemResource, 'item', full=True, null=True)

    class Meta:
        queryset = models.Vote.objects.filter(
            item__theme__agenda__is_visible=True)
        allowed_methods = ['get']
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'item': ALL_WITH_RELATIONS,
            'datetime': ALL
        }
