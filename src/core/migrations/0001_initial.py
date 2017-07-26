# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-26 17:04
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Agenda',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('initial_date', models.DateField(verbose_name='Initial date')),
                ('end_date', models.DateField(verbose_name='End date')),
                ('title', models.CharField(max_length=100, verbose_name='Title')),
                ('description', models.TextField(verbose_name='Description')),
                ('is_visible', models.BooleanField(default=True, verbose_name='Visible')),
                ('votes_count', models.IntegerField(default=0)),
                ('participants_count', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Agenda',
                'verbose_name_plural': 'Agendas',
            },
        ),
        migrations.CreateModel(
            name='Proposal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=250, verbose_name='Title')),
                ('description', models.TextField(verbose_name='Description')),
                ('number', models.IntegerField()),
                ('year', models.IntegerField()),
                ('url', models.CharField(max_length=250, verbose_name='URL')),
            ],
            options={
                'verbose_name': 'Proposal',
                'verbose_name_plural': 'Proposals',
            },
        ),
        migrations.CreateModel(
            name='ProposalGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('agenda', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='groups', to='core.Agenda')),
                ('proposals', models.ManyToManyField(related_name='groups', to='core.Proposal')),
            ],
            options={
                'verbose_name': 'Proposal Group',
                'verbose_name_plural': 'Proposal Groups',
            },
        ),
        migrations.CreateModel(
            name='ProposalType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=50)),
                ('initials', models.CharField(max_length=25)),
            ],
            options={
                'verbose_name': 'Proposal Type',
                'verbose_name_plural': 'Proposal Types',
            },
        ),
        migrations.CreateModel(
            name='Theme',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, verbose_name='Name')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
            ],
            options={
                'verbose_name': 'Theme',
                'verbose_name_plural': 'Themes',
            },
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField(auto_now=True)),
                ('vote', models.BooleanField()),
                ('proposal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='core.Proposal', verbose_name='Proposal')),
                ('proposal_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='core.ProposalGroup', verbose_name='Proposal Group')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Vote',
                'verbose_name_plural': 'Votes',
            },
        ),
        migrations.AddField(
            model_name='proposalgroup',
            name='theme',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='agendas', to='core.Theme'),
        ),
        migrations.AddField(
            model_name='proposal',
            name='proposal_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proposals', to='core.ProposalType'),
        ),
        migrations.AlterUniqueTogether(
            name='proposal',
            unique_together=set([('proposal_type', 'year', 'number')]),
        ),
    ]
