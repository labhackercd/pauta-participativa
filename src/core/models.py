from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.conf import settings
from django.utils.text import slugify


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
    votes_count = models.IntegerField(default=0)
    participants_count = models.IntegerField(default=0)

    class Meta:
        verbose_name = _("Agenda")
        verbose_name_plural = _("Agendas")

    def __str__(self):
        return '{} - {}'.format(self.initial_date, self.end_date)


class ProposalGroup(models.Model):

    theme = models.ForeignKey('core.Theme', related_name='agendas')
    agenda = models.ForeignKey('core.Agenda', related_name='groups')
    proposals = models.ManyToManyField('core.Proposal', related_name='groups')

    class Meta:
        verbose_name = "Proposal Group"
        verbose_name_plural = "Proposal Groups"

    def __str__(self):
        return self.theme.slug


class ProposalType(models.Model):

    description = models.CharField(max_length=50)
    initials = models.CharField(max_length=25)

    class Meta:
        verbose_name = "Proposal Type"
        verbose_name_plural = "Proposal Types"

    def __str__(self):
        return self.initials


class Proposal(models.Model):

    title = models.CharField(max_length=250, verbose_name=_("Title"))
    description = models.TextField(verbose_name=_("Description"))
    proposal_type = models.ForeignKey('core.ProposalType',
                                      related_name='proposals')
    number = models.IntegerField()
    year = models.IntegerField()
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
    datetime = models.DateTimeField(auto_now=True)
    vote = models.BooleanField()

    class Meta:
        verbose_name = _("Vote")
        verbose_name_plural = _("Votes")

    def __str__(self):
        return str(self.user)
