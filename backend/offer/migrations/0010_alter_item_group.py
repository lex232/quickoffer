# Generated by Django 4.1.6 on 2024-05-07 09:41

from django.db import migrations
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('offer', '0009_brand_alter_group_options_group_level_group_lft_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='group',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='items', to='offer.group', verbose_name='Категория'),
        ),
    ]
