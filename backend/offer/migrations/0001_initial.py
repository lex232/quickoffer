# Generated by Django 4.1.6 on 2024-04-12 08:19

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='название')),
                ('ogrn', models.CharField(blank=True, max_length=200, null=True, verbose_name='огрн')),
                ('inn', models.CharField(blank=True, max_length=200, null=True, verbose_name='инн')),
                ('kpp', models.CharField(blank=True, max_length=200, null=True, verbose_name='кпп')),
                ('address_reg', models.CharField(blank=True, max_length=200, null=True, verbose_name='адрес юридической регистрации')),
                ('address_post', models.CharField(blank=True, max_length=200, null=True, verbose_name='почтовый адрес')),
                ('bill_num', models.CharField(blank=True, max_length=200, null=True, verbose_name='расчетный счет')),
                ('bill_corr_num', models.CharField(blank=True, max_length=200, null=True, verbose_name='корреспондентский счет')),
                ('bank_name', models.CharField(blank=True, max_length=200, null=True, verbose_name='имя банка')),
                ('image', models.ImageField(blank=True, null=True, upload_to='media/client/image', verbose_name='изображение')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'клиент',
                'verbose_name_plural': 'клиенты',
                'ordering': ['-title'],
            },
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='название')),
                ('slug', models.SlugField(unique=True)),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name': 'группа',
                'verbose_name_plural': 'группы',
                'ordering': ['-slug'],
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, unique=True, verbose_name='название товара')),
                ('description', models.TextField(blank=True, null=True, verbose_name='описание')),
                ('pub_date', models.DateField(auto_now_add=True)),
                ('pub_time', models.TimeField(auto_now_add=True)),
                ('price_retail', models.FloatField(verbose_name='розничная цена')),
                ('image', models.ImageField(blank=True, null=True, upload_to='media/item/image', verbose_name='изображение товара')),
                ('quantity_type', models.CharField(choices=[('pc', 'шт.'), ('meters', 'м.')], default='pc', max_length=20, null=True, verbose_name='количественная характеристика')),
                ('item_type', models.CharField(choices=[('product', 'товар'), ('service', 'услуга')], db_index=True, default='product', max_length=20, verbose_name='тип - товар или услуга')),
                ('private_type', models.BooleanField(default=False, verbose_name='Приватность товара/ услуги')),
                ('group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='offer.group', verbose_name='группа товара')),
            ],
            options={
                'verbose_name': 'товар пользовательский',
                'verbose_name_plural': 'товары пользовательские',
                'ordering': ['-pub_date', '-pub_time'],
            },
        ),
        migrations.CreateModel(
            name='OfferForCustomer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_offer', models.CharField(max_length=250, verbose_name='название КП')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('status_type', models.CharField(choices=[('in_edit', 'на редактировании'), ('in_process', 'КП отправлено'), ('in_prepayment', 'получена предоплата'), ('in_install', 'в работе'), ('in_payment', 'получена оплата')], default='in_edit', max_length=30, null=True, verbose_name='Статус КП')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offer', to=settings.AUTH_USER_MODEL)),
                ('name_client', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='offer.client', verbose_name='Клиент')),
            ],
            options={
                'verbose_name': 'коммерческое предложение',
                'verbose_name_plural': 'коммерческие предложения',
                'ordering': ('-created',),
            },
        ),
        migrations.CreateModel(
            name='ItemUser',
            fields=[
                ('item_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='offer.item')),
            ],
            options={
                'verbose_name': 'товар пользовательский',
                'verbose_name_plural': 'товары пользовательские',
                'ordering': ['-pub_date', '-pub_time'],
            },
            bases=('offer.item',),
        ),
        migrations.CreateModel(
            name='OfferItems',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.PositiveSmallIntegerField(default=1, null=True, verbose_name='позиция')),
                ('item_price_retail', models.FloatField(default=0, null=True, verbose_name='розничная цена')),
                ('item_price_purchase', models.FloatField(default=0, null=True, verbose_name='закупка')),
                ('amount', models.PositiveSmallIntegerField(default=1, validators=[django.core.validators.MinValueValidator(1, message='Нельзя добавить меньше 1 штук позиции')], verbose_name='количество')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='item', to='offer.item')),
                ('offer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offers', to='offer.offerforcustomer')),
            ],
            options={
                'verbose_name': 'количество товара в КП',
                'verbose_name_plural': 'количество товаров в КП',
                'ordering': ['-position'],
            },
        ),
        migrations.AddConstraint(
            model_name='offeritems',
            constraint=models.UniqueConstraint(fields=('offer', 'item'), name='Такой товар в КП уже есть!'),
        ),
        migrations.AddConstraint(
            model_name='offerforcustomer',
            constraint=models.UniqueConstraint(fields=('author', 'name_offer'), name='КП с таким именем уже есть!'),
        ),
        migrations.AddField(
            model_name='itemuser',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='item', to=settings.AUTH_USER_MODEL),
        ),
    ]
