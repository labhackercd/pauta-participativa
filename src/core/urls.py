from django.conf.urls import url
from core import views


urlpatterns = [
    url(r'^$', views.HomeView.as_view(), name='home'),
    url(r'^pauta/(?P<pk>\d+)/?$', views.AgendaView.as_view(),
        name='agenda'),
    url(r'^pauta/(?P<pk>\d+)/compartilhar/?$', views.ShareAgendaView.as_view(),
        name='share_agenda'),
]
