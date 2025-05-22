import os
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class Charm(models.Model):
    CHARM_CATEGORY_CHOICES = [
        ('alphabet', 'Alphabet'),
        ('birthstone', 'Birthstone'),
        ('birthstone_mini', 'Birthstone Mini'),
        ('birth_flower', 'Birth Flower'),
        ('number', 'Number'),
        ('special', "Sparklore's Special"),
        ('zodiac', 'Zodiac'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CHARM_CATEGORY_CHOICES)
    image = models.ImageField(upload_to='charms/')
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} ({self.category})"
    
    def clean(self):
        if self.price < 0:
            raise ValidationError("Harga charms tidak boleh negatif.")


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('necklace', 'Necklace'),
        ('bracelet', 'Bracelet'),
        ('earring', 'Earring'),
        ('ring', 'Ring'),
        ('anklet', 'Anklet'),
        ('gift_set', 'Gift Set'),
        ('charm', 'Charm'),
    ]

    LABEL_CHOICES = [
        ('gold', 'Gold'),
        ('silver', 'Silver'),
        ('rose_gold', 'Rose Gold'),
        ('null', 'Null'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    charms = models.ManyToManyField(Charm, blank=True)
    label = models.CharField(max_length=100, choices=LABEL_CHOICES)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    description = models.TextField(blank=True, null=True)
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    sold_stok = models.IntegerField(default=0)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Produk di dalam gift set
    gift_set_products = models.ManyToManyField('self', blank=True, symmetrical=False)

    def __str__(self):
        return f"{self.name} ({self.category})"
    
    def clean(self):
        if self.price < 0:
            raise ValidationError("Harga produk tidak boleh negatif.")
        if self.stock < 0:
            raise ValidationError("Stok tidak boleh negatif.")

def product_image_upload_path(instance, filename):
    return f"products/{instance.product.id}/{filename}"

class ProductImage(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=product_image_upload_path)
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Gambar untuk {self.product.name}"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')], max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_address = models.CharField(max_length=255)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Order {self.id} by {self.user.email} - {self.status}"

class NewsletterSubscriber(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email

class Review(models.Model):
    user_name = models.CharField(max_length=100)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    review_text = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="review_images/", blank=True, null=True)
    products = models.ManyToManyField(Product)

    def __str__(self):
        return f"{self.user_name} - {self.rating}⭐"
    
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=1)
    charms = models.ManyToManyField(Charm, blank=True, through='CartItemCharm')

class CartItemCharm(models.Model):
    item = models.ForeignKey(CartItem, on_delete=models.CASCADE)
    charm = models.ForeignKey(Charm, on_delete=models.CASCADE)