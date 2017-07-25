from django import forms
from django.forms.models import BaseInlineFormSet
from django.utils.translation import ugettext_lazy as _


class AtLeastRequiredFormSet(BaseInlineFormSet):
    MIN_FORMS = 1

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
        if initial_num + extra_num < self.MIN_FORMS:
            raise forms.ValidationError(
                _("At least %s item(s) is required." % self.MIN_FORMS)
            )


class AgendaFormset(AtLeastRequiredFormSet):

    def clean(self):
        super(AgendaFormset, self).clean()
        for form in self.forms:
            proposals = dict(self.data).get(form.prefix + '-proposals', None)
            error_message = None
            if proposals:
                if len(proposals) < 4:
                    error_message = _("You must select at least 4 proposals")
                    raise forms.ValidationError(error_message)
