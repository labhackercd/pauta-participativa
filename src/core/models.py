from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from datetime import date


class Theme(models.Model):

    name = models.CharField(max_length=250, verbose_name=_("Name"))
    slug = models.CharField(max_length=250, verbose_name=_("Slug"))

    class Meta:
        verbose_name = _("Theme")
        verbose_name_plural = _("Themes")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        return super(Theme, self).save(*args, **kwargs)


class Agenda(models.Model):

    initial_date = models.DateField(verbose_name=_("Initial date"))
    end_date = models.DateField(verbose_name=_("End date"))
    title = models.CharField(max_length=100, verbose_name=_("Title"))
    description = models.TextField(verbose_name=_("Description"))
    is_visible = models.BooleanField(default=True, verbose_name=_("Visible"))
    votes_count = models.IntegerField(default=0, verbose_name=_("Votes count"))
    participants_count = models.IntegerField(
        default=0, verbose_name=_("Participants count")
    )

    class Meta:
        verbose_name = _("Agenda")
        verbose_name_plural = _("Agendas")

    def __str__(self):
        return '{} - {}'.format(self.initial_date, self.end_date)

    @property
    def is_closed(self):
        return date.today() > self.end_date


class ProposalGroup(models.Model):

    theme = models.ForeignKey('core.Theme', related_name='agendas',
                              verbose_name=_("Theme"))
    agenda = models.ForeignKey('core.Agenda', related_name='groups',
                               verbose_name=_("Agenda"))
    proposals = models.ManyToManyField('core.Proposal', related_name='groups',
                                       verbose_name=_("Proposals"))

    class Meta:
        verbose_name = "Proposal Group"
        verbose_name_plural = "Proposal Groups"

    def __str__(self):
        return self.theme.slug


class ProposalType(models.Model):

    description = models.CharField(max_length=50,
                                   verbose_name=_("Description"))
    initials = models.CharField(max_length=25,
                                verbose_name=_("Initials"))

    class Meta:
        verbose_name = "Proposal Type"
        verbose_name_plural = "Proposal Types"

    def __str__(self):
        return self.initials


class Proposal(models.Model):

    title = models.CharField(max_length=250, verbose_name=_("Title"))
    description = models.TextField(verbose_name=_("Description"))
    proposal_type = models.ForeignKey('core.ProposalType',
                                      related_name='proposals',
                                      verbose_name=_("Proposal type"))
    number = models.IntegerField(verbose_name=_("Number"))
    year = models.IntegerField(verbose_name=_("Year"))
    url = models.CharField(max_length=250, verbose_name=_("URL"))

    class Meta:
        verbose_name = _("Proposal")
        verbose_name_plural = _("Proposals")
        unique_together = ('proposal_type', 'year', 'number')

    def __str__(self):
        return self.title


class Vote(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_("User"),
                             related_name='votes')
    proposal = models.ForeignKey('core.Proposal', verbose_name=_("Proposal"),
                                 related_name='votes')
    proposal_group = models.ForeignKey('core.ProposalGroup',
                                       verbose_name=_("Proposal Group"),
                                       related_name='votes')
    agenda = models.ForeignKey('core.Agenda', verbose_name=_("Proposal Group"),
                               related_name='participants')
    datetime = models.DateTimeField(auto_now=True, verbose_name=_("Datetime"))
    vote = models.BooleanField(verbose_name=_("Vote"))

    class Meta:
        verbose_name = _("Vote")
        verbose_name_plural = _("Votes")
        unique_together = ('user', 'proposal', 'proposal_group', 'agenda')

    def __str__(self):
        return str(self.user)
