# Pauta Participativa
A Pauta Participativa é uma forma de você ajudar a Câmara a definir a prioridade de votações dos projetos. Para cada tema, você pode escolher até DOIS projetos para serem votados pelo plenário.
Se desejar, você também poderá escolher um projeto que não deva ser votado.
Ao final do período de consulta (15 dias), a Câmara colocará em votação os projetos de cada tema que tenham obtido o maior saldo positivo de votos, ou seja, votos favoráveis menos votos contrários. Participe!

# Contributing

You'll need `Python 3` and `npm` to run Pauta Participativa.

```
npm install
pip install -r requirements.txt

cd src/
./manage.py migrate
./manage.py loaddata core/fixtures/themes.json # Optional. This command will load initials themes
./manage.py collectstatic_js_reverse
./manage.py createsuperuser
```

# Branch Policy
You should create a new branch to make a contribution. The branch naming conventino is the following:
- `feature/feature-name` for adding a new feature
- `fix/bug-name` for fixing a bug
The branches `master` and `develop` can only have commit trhough Pull Request from `feature/*` and `fix/*` branches.
