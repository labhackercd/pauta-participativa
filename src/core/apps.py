from django.apps import AppConfig
from django.db.models.signals import post_save, post_delete


class CoreConfig(AppConfig):
    name = 'core'

    def ready(self):
        from core import signals
        post_save.connect(signals.increment_counters, sender='core.Vote')
        post_delete.connect(signals.decrement_counters, sender='core.Vote')
