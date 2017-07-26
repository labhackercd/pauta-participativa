

def increment_counters(sender, instance, created, **kwargs):
    agenda = instance.proposal_group.agenda
    if created:
        agenda.votes_count += 1

    same_author = instance.proposal_group.votes.filter(user=instance.user)
    if len(same_author) == 1:
        agenda.participants_count += 1
    agenda.save()


def decrement_counters(sender, instance, **kwargs):
    agenda = instance.proposal_group.agenda
    agenda.votes_count -= 1

    same_author = instance.proposal_group.votes.filter(user=instance.user)

    if len(same_author) == 0:
        agenda.participants_count -= 1

    agenda.save()
