from django.contrib.auth.backends import RemoteUserBackend
from django.contrib.auth import get_user_model
import json
UserModel = get_user_model()


class PautaParticipativaBackend(RemoteUserBackend):

    def authenticate(self, remote_user, request=None):
        if not remote_user:
            return
        user = None
        remote_user_data = json.loads(
            request.META.get('HTTP_REMOTE_USER_DATA')
        )
        user, created = UserModel.objects.get_or_create(
            username=remote_user
        )

        user.first_name = remote_user_data['name']
        user.email = remote_user_data['email']
        user.save()

        return user
