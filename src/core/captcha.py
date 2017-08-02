from django.conf import settings
import requests


ERRORS = {
    'missing-input-secret': 'The secret parameter is missing',
    'invalid-input-secret': 'The secret parameter is invalid or malformed',
    'missing-input-response': 'The response parameter is missing',
    'invalid-input-response': 'The response parameter is invalid or malformed',
    'bad-request': 'The request is invalid or malformed',
}


def verify(captcha_response, remote_ip=None):
    url = "https://www.google.com/recaptcha/api/siteverify"
    params = {
        'secret': settings.RECAPTCHA_PRIVATE_KEY,
        'response': captcha_response,
    }

    if remote_ip:
        params['remoteip'] = remote_ip

    verify_response = requests.get(url, params=params, verify=True)
    return verify_response.json()
