# Generated by Django 4.2.6 on 2023-11-09 07:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_fileupload'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatmessage',
            name='uploaded',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='chat.fileupload'),
        ),
    ]
