from django.conf.urls import url
from core import views
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^method/?$', TemplateView.as_view(template_name='pages/method.html'),
        name='method'),
    url(r'^relatorio-pauta-1/?$', TemplateView.as_view(template_name='pages/relatorio-pauta-1.html'),
        name='relatorio-pauta-1'),
    url(r'^relatorio-pauta-1-observadores/?$', TemplateView.as_view(template_name='pages/relatorio-pauta-1-observadores.html'),
        name='relatorio-pauta-1-observadores'),
    url(r'^$', views.HomeView.as_view(), name='home'),
    url(r'^pauta/(?P<pk>\d+)/?$', views.AgendaView.as_view(),
        name='agenda'),
    url(r'^pauta/(?P<pk>\d+)/metas/?$', views.AgendaMetaView.as_view(),
        name='agenda_meta'),
]
