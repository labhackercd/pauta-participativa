from django import forms
from django.forms.models import BaseInlineFormSet
from django.utils.translation import ugettext_lazy as _


class AtLeastRequiredFormSet(BaseInlineFormSet):
    MIN_ITEMS = 1

    def clean(self):
        super(AtLeastRequiredFormSet, self).clean()

        initial_num = len(list(filter(
            lambda f: not self._should_delete_form(f),
            self.initial_forms
        )))
        extra_num = len(list(filter(
            lambda f: f.has_changed() and not self._should_delete_form(f),
            self.extra_forms
        )))
        if initial_num + extra_num < self.MIN_ITEMS:
            raise forms.ValidationError(
                _("At least %s item(s) is required." % self.MIN_ITEMS)
            )


class AtLeastOneRequiredFormSet(AtLeastRequiredFormSet):
    MIN_ITEMS = 1


class AtLeastTwoRequiredFormSet(AtLeastRequiredFormSet):
    MIN_ITEMS = 2
