from django.http import Http404, JsonResponse
from django.views.generic import ListView, DetailView
from core import models, captcha
import json


class HomeView(ListView):
    template_name = 'home.html'
    model = models.Agenda
    queryset = models.Agenda.objects.filter(is_visible=True)


class AgendaView(DetailView):
    model = models.Agenda
    template_name = 'agenda.html'

    def get_object(self, queryset=None):
        obj = super(AgendaView, self).get_object(queryset)
        if not obj.is_visible:
            raise Http404
        else:
            return obj

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            user = request.user
        else:
            return JsonResponse({'message': 'Fazer login'},
                                status=403)

        data = json.loads(request.POST.get('data'))
        captcha_response = captcha.verify(data['recaptchaResponse'])

        if captcha_response['success']:
            groups_count = len(data['groups'])
            empty_groups = 0
            for group in data['groups']:
                votes = group['votes']
                if len(votes) == 3:
                    self.create_votes(user, votes, group['groupId'])
                elif len(votes) < 3 and len(votes) > 0:
                    return JsonResponse({'message': 'Gastar todos os votos'},
                                        status=400)
                else:
                    empty_groups += 1

            if groups_count == empty_groups:
                return JsonResponse({'message': 'Vote em pelo menos um'},
                                    status=400)
            else:
                return JsonResponse({'message': 'Tudo certo'})
        else:
            message = ' '.join(
                map(lambda x: captcha.ERRORS[x],
                    captcha_response['error-codes'])
            )
            return JsonResponse({'message': message},
                                status=400)

    def create_votes(self, user, votes, group_id):
        for vote in votes:
            models.Vote.objects.create(
                user=user,
                proposal_id=vote["name"],
                proposal_group_id=group_id,
                vote=self.get_vote_type(vote["value"]),
                agenda=self.get_object()
            )

    def get_vote_type(self, vote):
        if vote == 'upvote':
            return True
        else:
            return False
