from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.conf import settings

# Create your models here.


class Agenda(models.Model):

    initial_date = models.DateField(verbose_name=_("Initial date"))
    end_date = models.DateField(verbose_name=_("End date"))
    meeting_date = models.DateField(verbose_name=_("Meeting date"))
    briefing = models.TextField(verbose_name=_("Briefing"))
    is_visible = models.BooleanField(default=True, verbose_name=_("Visible"))

    class Meta:
        verbose_name = _("Agenda")
        verbose_name_plural = _("Agendas")

    def __str__(self):
        return '{} - {}'.format(self.initial_date, self.end_date)


class Theme(models.Model):

    name = models.CharField(max_length=250, verbose_name=_("Name"))
    icon = models.CharField(max_length=100, verbose_name=_("Icon"),
                            help_text=_("Can be any icon name from Fontastic"))
    agenda = models.ForeignKey('core.Agenda', related_name='themes',
                               verbose_name=_("Agenda"))

    class Meta:
        verbose_name = _("Theme")
        verbose_name_plural = _("Themes")

    def __str__(self):
        return self.name


class Item(models.Model):

    title = models.CharField(max_length=250, verbose_name=_("Title"))
    description = models.TextField(verbose_name=_("Description"))
    link = models.CharField(max_length=250, verbose_name=_("Link"))
    theme = models.ForeignKey('core.Theme', related_name='items',
                              verbose_name=_("Theme"))

    class Meta:
        verbose_name = _("Item")
        verbose_name_plural = _("Items")

    def __str__(self):
        return self.title


class Vote(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_("User"),
                             related_name='votes')
    item = models.ForeignKey('core.Item', verbose_name=_("Item"),
                             related_name='votes')
    datetime = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Vote")
        verbose_name_plural = _("Votes")

    def __str__(self):
        return str(self.user)
