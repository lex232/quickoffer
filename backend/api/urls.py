"""urls.py уровня приложения api"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
# from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from api.v1.users.views import UserViewSet
from api.v1.offer.views import (
    OfferViewSet,
    ItemViewSet
)
from api.v1.clients.views import ClientOfferViewSet
from api.v1.groups.views import GroupOfferViewSet

router_offer = DefaultRouter()

# Роутер КП
router_offer.register(
    'offers',
    OfferViewSet,
    basename='offers'
)

# Роутер группы товаров
router_offer.register(
    'groups',
    GroupOfferViewSet,
    basename='groups'
)

# Роутер клиентов
router_offer.register(
    'clients',
    ClientOfferViewSet,
    basename='clients'
)

# Роутер товаров
router_offer.register(
    'items',
    ItemViewSet,
    basename='items'
)

# Роутер пользователей
router_offer.register(
    'users',
    UserViewSet,
    basename='users'
)



api_urlpatterns = [
    path('api/', include(router_offer.urls)),
    path('api/auth/', include('djoser.urls.authtoken')),
    # API СХЕМА
    # path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name="docs"),
    # path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name="redoc"),
]