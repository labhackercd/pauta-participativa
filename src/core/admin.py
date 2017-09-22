from django.contrib import admin
from core import models, forms
import nested_admin


@admin.register(models.Theme)
class ThemeAdmin(admin.ModelAdmin):
    search_fields = ('name', )
    exclude = ('slug', )


@admin.register(models.ProposalType)
class ProposalTypeAdmin(admin.ModelAdmin):
    list_display = ('initials', 'description')
    search_fields = ('initials', 'description')


@admin.register(models.Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('title', 'proposal_type', 'number', 'year')
    list_filter = ('proposal_type', 'number', 'year', 'custom_url')
    search_fields = ('title', 'description')


@admin.register(models.Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'proposal', 'proposal_group', 'agenda', 'vote')
    list_filter = ('proposal', 'proposal_group', 'agenda', 'vote')
    search_fields = (
        'user__email', 'user__first_name', 'agenda__title',
        'proposal__title', 'proposal_group__theme__name')
    readonly_fields = ('ip', )


class ProposalGroupInline(nested_admin.NestedStackedInline):
    model = models.ProposalGroup
    extra = 1
    fk_name = 'agenda'
    filter_horizontal = ('proposals', )
    formset = forms.AgendaFormset


@admin.register(models.Agenda)
class AgendaAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'description', 'initial_date', 'end_date')
    search_fields = ('description', )
    list_filter = ('initial_date', 'end_date')
    inlines = (ProposalGroupInline, )
    readonly_fields = ('votes_count', 'participants_count')
