from django.contrib import admin
from .models import Charm, Product, Order, Review, NewsletterSubscriber

@admin.register(Charm)
class CharmAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price')
    list_filter = ('category',)
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'label', 'stock')
    list_filter = ('category', 'label')
    filter_horizontal = ('charms', 'gift_set_products') 
    search_fields = ['name']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_price', 'status')
    list_filter = ('status',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'rating', 'uploaded_at')
    list_filter = ('rating',)

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('user', 'subscribed_at')
