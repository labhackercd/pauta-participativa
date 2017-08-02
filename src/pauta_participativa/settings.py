from decouple import config, Csv
import django.conf.global_settings as default
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# APPLICATION SETTINGS
SECRET_KEY = config('SECRET_KEY', default='secret_key')
API_KEY = config('API_KEY', default='api_key')

RECAPTCHA_SITE_KEY = config(
    'RECAPTCHA_SITE_KEY',
    default='6LeqwioUAAAAAJQwLBKGmmpuazIQM6hEYYoFSTYW'
)
RECAPTCHA_PRIVATE_KEY = config(
    'RECAPTCHA_PRIVATE_KEY',
    default='6LeqwioUAAAAAHs4i1Zq4D_9kc1I-OL0TmaUowq3'
)


FORCE_SCRIPT_NAME = config('FORCE_SCRIPT_NAME', default=None)
SITE_ID = 1

DEBUG = config('DEBUG', cast=bool, default=True)
ALLOWED_HOSTS = config('ALLOWED_HOSTS',
                       cast=Csv(lambda x: x.strip().strip(',').strip()),
                       default='*')

ROOT_URLCONF = 'pauta_participativa.urls'

WSGI_APPLICATION = 'pauta_participativa.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.' + config('DATABASE_ENGINE',
                                                 default='sqlite3'),
        'NAME': config('DATABASE_NAME', default='db.sqlite3'),
        'USER': config('DATABASE_USER', default=''),
        'PASSWORD': config('DATABASE_PASSWORD', default=''),
        'HOST': config('DATABASE_HOST', default=''),
        'PORT': config('DATABASE_PORT', default=''),
    }
}


# APPS SETTINGS
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'compressor',
    'compressor_toolkit',
    'nested_admin',
    'tastypie',
    'django_js_reverse',
]

MAIN_APPS = [
    'core',
    'api',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + MAIN_APPS


# MIDDLEWARES SETTINGS
DJANGO_MIDDLEWARES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

THIRD_PARTY_MIDDLEWARES = []

PAUTA_MIDDLEWARES = []

if config('ENABLE_REMOTE_USER', default=0, cast=bool):
    PAUTA_MIDDLEWARES += ['accounts.middlewares.PautaRemoteUser']
    DJANGO_MIDDLEWARES.remove(
        'django.contrib.auth.middleware.SessionAuthenticationMiddleware'
    )

MIDDLEWARE = DJANGO_MIDDLEWARES + THIRD_PARTY_MIDDLEWARES + PAUTA_MIDDLEWARES


# AUTH SETTINGS
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.'
                'UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.'
                'MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.'
                'CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.'
                'NumericPasswordValidator',
    },
]

if config('ENABLE_REMOTE_USER', default=0, cast=bool):
    AUTHENTICATION_BACKENDS = (
        'accounts.backends.PautaParticipativaBackend',
    )
else:
    AUTHENTICATION_BACKENDS = (
        'django.contrib.auth.backends.ModelBackend',
    )

SESSION_COOKIE_NAME = config('SESSION_COOKIE_NAME', default='sessionid')


# LOCALE SETTINGS
LANGUAGE_CODE = config('LANGUAGE_CODE', default='pt-br')
TIME_ZONE = config('TIME_ZONE', default='America/Sao_Paulo')
USE_I18N = True
USE_L10N = True
USE_TZ = True

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]

LANGUAGES = (
    ('en', 'English'),
    ('pt-br', 'Brazilian Portuguese'),
)


# EMAIL SETTINGS
EMAIL_HOST = config('EMAIL_HOST', default='localhost')
EMAIL_PORT = config('EMAIL_PORT', cast=int, default=587)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
EMAIL_USE_TLS = config('EMAIL_USE_TLS', cast=bool, default=True)
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='')


# LOGGING SETTINGS
if not DEBUG:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': True,
        'formatters': {
            'verbose': {
                'format': '%(asctime)s (%(name)s) %(levelname)s: %(message)s'
            }
        },
        'handlers': {
            'file': {
                'level': 'DEBUG',
                'interval': 24,
                'backupCount': 7,
                'encoding': 'UTF-8',
                'formatter': 'verbose',
                'class': 'logging.handlers.TimedRotatingFileHandler',
                'filename': config(
                    'LOG_DIR', default=BASE_DIR + '/pauta-participativa.log'
                ),
            }
        },
        'loggers': {
            'django': {
                'handlers': ['file'],
                'level': 'ERROR',
            },
        },
    }


# STATICFILES SETTINGS
STATIC_URL = config('STATIC_URL', default='/static/')
STATIC_ROOT = os.path.abspath(os.path.join(BASE_DIR, 'public'))

STATICFILES_FINDERS = default.STATICFILES_FINDERS + [
    'npm.finders.NpmFinder',
    'compressor.finders.CompressorFinder',
]

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

NPM_ROOT_PATH = os.path.dirname(BASE_DIR)


COMPRESS_PRECOMPILERS = [
    ('text/x-scss', 'compressor_toolkit.precompilers.SCSSCompiler'),
]

NODE_MODULES = os.path.join(os.path.dirname(BASE_DIR), 'node_modules')
COMPRESS_NODE_MODULES = NODE_MODULES
COMPRESS_NODE_SASS_BIN = os.path.join(NODE_MODULES, '.bin/node-sass')
COMPRESS_POSTCSS_BIN = os.path.join(NODE_MODULES, '.bin/postcss')

if not DEBUG:
    COMPRESS_SCSS_COMPILER_CMD = '{node_sass_bin}' \
                                 ' --source-map true' \
                                 ' --source-map-embed true' \
                                 ' --source-map-contents true' \
                                 ' --output-style expanded' \
                                 ' {paths} "{infile}" "{outfile}"' \
                                 ' &&' \
                                 ' {postcss_bin}' \
                                 ' --use "{node_modules}/autoprefixer"' \
                                 ' --autoprefixer.browsers' \
                                 ' "{autoprefixer_browsers}"' \
                                 ' -r "{outfile}"'

DJANGO_CONTEXT_PROCESSORS = [
    'django.template.context_processors.debug',
    'django.template.context_processors.request',
    'django.template.context_processors.media',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
]

THIRD_PARTY_CONTEXT_PROCESSORS = [
]

CONTEXT_PROCESSORS = DJANGO_CONTEXT_PROCESSORS + THIRD_PARTY_CONTEXT_PROCESSORS

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': CONTEXT_PROCESSORS,
        },
    },
]
