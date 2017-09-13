from core import models
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


@register.assignment_tag()
def get_vote(user, proposal, group, agenda):
    if user.is_authenticated():
        try:
            vote = proposal.votes.get(
                user=user,
                proposal_group=group,
                agenda=agenda
            )
            return vote.vote
        except models.Vote.DoesNotExist:
            return None
    else:
        return None


@register.filter()
def upvotes(proposal, group):
    return proposal.upvotes_count(group.id)


@register.filter()
def downvotes(proposal, group):
    return proposal.downvotes_count(group.id)


@register.filter()
def score(proposal, group):
    proposal_upvotes = upvotes(proposal, group)
    proposal_downvotes = downvotes(proposal, group)
    return proposal_upvotes - proposal_downvotes


@register.assignment_tag()
def ordered_proposals(group):
    queryset = group.proposals.all()
    order_by_upvote = sorted(queryset, key=lambda x: upvotes(x, group),
                             reverse=True)
    return sorted(order_by_upvote, key=lambda x: score(x, group), reverse=True)


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


@register.assignment_tag()
def maximum_votes(agenda):
    votes_counts = [
        max(proposal.upvotes_count(group.id),
            proposal.downvotes_count(group.id))
        for group in agenda.groups.all()
        for proposal in group.proposals.all()
    ]
    return max(votes_counts)


@register.simple_tag()
def downvote_percentage(proposal, group, max_votes):
    votes_count = proposal.downvotes_count(group.id)
    try:
        percentage = (votes_count / max_votes)
    except ZeroDivisionError:
        percentage = 0

    return percentage * 100


@register.simple_tag()
def upvote_percentage(proposal, group, max_votes):
    votes_count = proposal.upvotes_count(group.id)
    try:
        percentage = (votes_count / max_votes)
    except ZeroDivisionError:
        percentage = 0

    return percentage * 100


def agenda_score_limits(agenda):
    scores = [
        score(proposal, group)
        for group in agenda.groups.all()
        for proposal in group.proposals.all()
    ]
    return (max(scores), min(scores))


@register.simple_tag()
def score_percentage(proposal, group, max_votes):
    max_score = upvote_percentage(proposal, group, max_votes)
    min_score = downvote_percentage(proposal, group, max_votes)
    return (max_score - min_score + 100) / 2
