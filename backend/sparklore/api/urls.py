from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CharmViewSet, OrderViewSet, ProductViewSet, CartViewSet, ReviewViewSet, NewsletterSubscriberViewSet

router = DefaultRouter()
router.register(r'charms', CharmViewSet, basename='charm')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'newsletters', NewsletterSubscriberViewSet, basename='newsletter')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
]
