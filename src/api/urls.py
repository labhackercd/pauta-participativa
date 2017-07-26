from django.conf.urls import url, include
from tastypie.api import Api
from api import resources

v1_api = Api(api_name='v1')
v1_api.register(resources.UserResource())
v1_api.register(resources.AgendaResource())
v1_api.register(resources.ThemeResource())
v1_api.register(resources.ProposalResource())
v1_api.register(resources.ProposalGroupResource())
v1_api.register(resources.ProposalTypeResource())

urlpatterns = [
    url(r'^api/', include(v1_api.urls)),
]
