from django.conf import settings
from django.template import Library
from random import shuffle
register = Library()


@register.filter()
def already_voted(user, agenda):
    if user.is_authenticated():
        return agenda.participants.filter(user=user).exists()
    else:
        return False


@register.filter()
def upvotes(proposal, agenda):
    return proposal.votes.filter(vote=True, agenda=agenda).count()


@register.filter()
def downvotes(proposal, agenda):
    return proposal.votes.filter(vote=False, agenda=agenda).count()


@register.filter()
def score(proposal, agenda):
    proposal_upvotes = upvotes(proposal, agenda)
    proposal_downvotes = downvotes(proposal, agenda)
    return proposal_upvotes - proposal_downvotes


@register.assignment_tag()
def ordered_proposals(group, agenda):
    queryset = group.proposals.all()
    return sorted(queryset, key=lambda x: score(x, agenda), reverse=True)


@register.simple_tag()
def recaptcha_site_key():
    return settings.RECAPTCHA_SITE_KEY


@register.filter()
def randomize(queryset):
    queryset_list = list(queryset)
    shuffle(queryset_list)
    return queryset_list


@register.assignment_tag()
def randomize_queryset(queryset):
    return randomize(queryset)
