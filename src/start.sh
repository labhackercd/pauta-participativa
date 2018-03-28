#!/bin/bash

while true; do
  PG_STATUS=`PGPASSWORD=$DATABASE_PASSWORD psql -U $DATABASE_USER  -w -h $DATABASE_HOST -c '\l \q' | grep postgres | wc -l`
  if ! [ "$PG_STATUS" -eq "0" ]; then
   break
  fi

  echo "Waiting Database Setup"
  sleep 10
done

PGPASSWORD=$DATABASE_PASSWORD psql -U $DATABASE_USER -w -h $DATABASE_HOST -c "CREATE DATABASE ${DATABASE_NAME} OWNER ${DATABASE_USER}"

python3 manage.py migrate

NAME="pauta_participativa"
[[ -z "${WORKERS}" ]] && NUM_WORKERS=2 || NUM_WORKERS="${WORKERS}"
DJANGO_WSGI_MODULE=pauta_participativa.wsgi

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --bind=0.0.0.0:8000
