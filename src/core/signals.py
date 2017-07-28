

def increment_counters(sender, instance, created, **kwargs):
    if created:
        instance.agenda.votes_count += 1

    participants = instance.agenda.participants.all().values_list('user_id',
                                                                  flat=True)
    instance.agenda.participants_count = len(set(participants))
    instance.agenda.save()


def decrement_counters(sender, instance, **kwargs):
    instance.agenda.votes_count -= 1

    participants = instance.agenda.participants.all().values_list('user_id',
                                                                  flat=True)
    instance.agenda.participants_count = len(set(participants))

    instance.agenda.save()
