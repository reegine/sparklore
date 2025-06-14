from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CharmViewSet, DiscountCampaignViewSet, GiftSetOrBundleMonthlySpecialViewSet, OrderViewSet, ProductViewSet, CartViewSet, ReviewViewSet, NewsletterSubscriberViewSet, get_shipping_cost, checkout, VideoContentViewSet, PageBannerViewSet, PhotoGalleryViewSet, direct_checkout, track_resi

router = DefaultRouter()
router.register(r'charms', CharmViewSet, basename='charm')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'newsletters', NewsletterSubscriberViewSet, basename='newsletter')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'videos', VideoContentViewSet, basename='video')
router.register(r'page-banners', PageBannerViewSet, basename='pagebanner')
router.register(r'discount-campaigns', DiscountCampaignViewSet, basename='discountcampaign')
router.register(r'photo-gallery', PhotoGalleryViewSet, basename='photogallery')
router.register(r'gift-sets', GiftSetOrBundleMonthlySpecialViewSet, basename='giftsetorbundlemonthlyspecial')


urlpatterns = [
    path('', include(router.urls)),
    path('checkout/', checkout, name='checkout'),
    path('direct_checkout/', direct_checkout, name='direct_checkout'),
    path('check_shipping_cost/', get_shipping_cost, name='check_shipping_cost'),
    path('track_resi/', track_resi, name='track_resi'),
]
