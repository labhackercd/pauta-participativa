from django.contrib import admin
from nested_admin import NestedStackedInline, NestedModelAdmin
from core import models, forms


class ItemInline(NestedStackedInline):
    model = models.Item
    extra = 2
    fk_name = 'theme'
    formset = forms.AtLeastTwoRequiredFormSet


class ThemeInline(NestedStackedInline):
    model = models.Theme
    extra = 1
    fk_name = 'poll'
    inlines = [ItemInline]
    formset = forms.AtLeastOneRequiredFormSet


class PollAdmin(NestedModelAdmin):
    list_display = ('meeting_date', 'briefing', 'initial_date', 'end_date')
    search_fields = ('briefing', )
    list_filter = ('initial_date', 'end_date', 'meeting_date')
    inlines = (ThemeInline, )


admin.site.register(models.Poll, PollAdmin)
