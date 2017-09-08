from django.contrib import admin
from core import models, forms
import nested_admin


@admin.register(models.Theme)
class ThemeAdmin(admin.ModelAdmin):
    exclude = ('slug', )


@admin.register(models.ProposalType)
class ProposalTypeAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Proposal)
class ProposalAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Vote)
class VoteAdmin(admin.ModelAdmin):
    pass


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
