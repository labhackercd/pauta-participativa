from django.conf import settings
from django.conf.urls import url
from django.contrib.auth import get_user_model
from api.authorization import UpdateUserAuthorization
from tastypie.resources import ModelResource, ALL_WITH_RELATIONS, ALL
from tastypie import fields
from core import models


class UserResource(ModelResource):

    def dehydrate(self, bundle):
        bundle.data.pop('is_active', None)
        bundle.data.pop('is_staff', None)
        bundle.data.pop('is_superuser', None)
        key = bundle.request.GET.get('api_key', None)
        if key != settings.API_KEY:
            del bundle.data['email']
        return bundle

    def prepend_urls(self):
        re_url = r"^(?P<resource_name>%s)/(?P<username>[\w\d_.-]+)/$".format(
            self._meta.resource_name
        )
        return [
            url(re_url, self.wrap_view('dispatch_detail'),
                name="api_dispatch_detail"),
        ]

    class Meta:
        queryset = get_user_model().objects.all()
        allowed_methods = ['get', 'put', 'delete']
        detail_uri_name = 'username'
        authorization = UpdateUserAuthorization()
        filtering = {
            'id': ALL,
            'first_name': ALL,
            'last_name': ALL,
            'username': ALL,
        }
        excludes = ['last_login', 'password', 'date_joined']


class ThemeResource(ModelResource):

    class Meta:
        queryset = models.Theme.objects.all()
        allowed_methods = ['get']
        filtering = {
            'id': ALL,
            'slug': ALL
        }


class AgendaResource(ModelResource):

    class Meta:
        queryset = models.Agenda.objects.filter(is_visible=True)
        allowed_methods = ['get']
        excludes = ['is_visible']
        filtering = {
            'id': ALL,
            'initial_date': ALL,
            'end_date': ALL,
            'title': ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['is_closed'] = bundle.obj.is_closed
        return bundle


class ProposalTypeResource(ModelResource):

    class Meta:
        queryset = models.ProposalType.objects.all()
        allowed_methods = ['get']
        filtering = {
            'id': ALL,
            'initials': ALL
        }


class ProposalResource(ModelResource):

    proposal_type = fields.ToOneField(ProposalTypeResource, 'proposal_type',
                                      full=True, null=True)

    class Meta:
        queryset = models.Proposal.objects.all()
        allowed_methods = ['get']
        filtering = {
            'id': ALL,
            'theme': ALL_WITH_RELATIONS,
            'proposal_type': ALL_WITH_RELATIONS,
            'title': ALL,
            'description': ALL
        }


class ProposalGroupResource(ModelResource):

    theme = fields.ToOneField(ThemeResource, 'theme', full=True, null=True)
    agenda = fields.ToOneField(AgendaResource, 'agenda', full=True, null=True)
    proposals = fields.ToManyField(ProposalResource, 'proposals',
                                   full=True, null=True)

    class Meta:
        queryset = models.ProposalGroup.objects.filter(agenda__is_visible=True)
        allowed_methods = ['get']
        filtering = {
            'id': ALL,
            'agenda': ALL_WITH_RELATIONS,
        }
