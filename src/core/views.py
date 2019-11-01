from django.contrib import messages
from django.contrib.sites.models import Site
from django.utils.translation import ugettext_lazy as _
from django.http import Http404, JsonResponse, HttpResponseRedirect, HttpResponse
from django.views.generic import ListView, DetailView
from django.urls import reverse
from core import models, captcha
import json
import csv


class HomeView(ListView):
    template_name = 'pages/home.html'
    model = models.Agenda
    queryset = models.Agenda.objects.filter(is_visible=True)


class AgendaMetaView(DetailView):
    model = models.Agenda
    template_name = 'pages/agenda_meta.html'

    def get_context_data(self, **kwargs):
        context = super(AgendaMetaView, self).get_context_data(**kwargs)
        context['domain'] = Site.objects.get_current().domain
        return context


class AgendaView(DetailView):
    model = models.Agenda
    template_name = 'pages/agenda.html'

    def get_object(self, queryset=None):
        obj = super(AgendaView, self).get_object(queryset)
        if not obj.is_visible:
            raise Http404
        else:
            return obj

    def get_context_data(self, **kwargs):
        context = super(AgendaView, self).get_context_data(**kwargs)
        context['domain'] = Site.objects.get_current().domain
        return context

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            user = request.user
        else:
            return JsonResponse(
                {'message': _('You must be logged to do this action')},
                status=403
            )

        data = json.loads(request.POST.get('data'))
        captcha_response = captcha.verify(data['recaptchaResponse'])

        if captcha_response['success']:
            groups_count = len(data['groups'])
            empty_groups = 0
            for group in data['groups']:
                votes = group['votes']
                if len(votes) <= 3:
                    self.create_votes(user, votes, group['groupId'], request)
                elif len(votes) > 3:
                    return JsonResponse(
                        {'message': _('You can vote at most three times')},
                        status=400
                    )
                else:
                    empty_groups += 1

            if groups_count == empty_groups:
                return JsonResponse(
                    {'message': _('You have to vote at least in one group')},
                    status=400
                )
            else:
                return JsonResponse({'message': _('Ok')})
        else:
            message = ' '.join(
                map(lambda x: captcha.ERRORS[x],
                    captcha_response['error-codes'])
            )
            return JsonResponse({'message': message},
                                status=400)

    def create_votes(self, user, votes, group_id, request):
        for vote in votes:
            models.Vote.objects.create(
                user=user,
                proposal_id=vote["name"],
                proposal_group_id=group_id,
                vote=self.get_vote_type(vote["value"]),
                ip=request.META.get('HTTP_X_REAL_IP', None),
                agenda=self.get_object()
            )

    def get_vote_type(self, vote):
        if vote == 'upvote':
            return True
        else:
            return False


def download_csv_results(request, pk):
    agenda = models.Agenda.objects.get(id=pk)
    proposal_groups = models.ProposalGroup.objects.filter(agenda=agenda)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="%s.csv"' % agenda.title

    writer = csv.writer(response)
    writer.writerow([_('Theme'), _('Proposal'), _('Up Votes'), _('Down Votes'), _('Score')])
    for group in proposal_groups:
        for proposal in group.proposals.all():
            score = proposal.upvotes_count(group.id) - proposal.downvotes_count(group.id)
            writer.writerow([
                group.theme.name,
                proposal.title,
                proposal.upvotes_count(group.id),
                proposal.downvotes_count(group.id),
                score
            ])

    return response