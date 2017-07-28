from django.conf.urls import url
from core import views


urlpatterns = [
    url(r'^$', views.HomeView.as_view(), name='home'),
    url(r'^pauta/(?P<pk>\d+)/?$', views.AgendaView.as_view(),
        name='agenda'),
    url(r'^pauta/(?P<pk>\d+)/submit/?$', views.SubmitVotesView.as_view(),
        name='submit_votes'),
]
