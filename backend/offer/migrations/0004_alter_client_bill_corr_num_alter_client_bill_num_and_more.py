# Generated by Django 4.1.6 on 2024-04-09 05:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('offer', '0003_client_image_alter_client_inn_alter_client_kpp_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='bill_corr_num',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='корреспондентский счет'),
        ),
        migrations.AlterField(
            model_name='client',
            name='bill_num',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='расчетный счет'),
        ),
        migrations.AlterField(
            model_name='client',
            name='inn',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='инн'),
        ),
        migrations.AlterField(
            model_name='client',
            name='kpp',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='кпп'),
        ),
        migrations.AlterField(
            model_name='client',
            name='ogrn',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='огрн'),
        ),
    ]
