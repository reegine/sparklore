from rest_framework import serializers
from .models import Charm, Product, Order, Review, NewsletterSubscriber, CartItem, Cart, CartItemCharm, VideoContent

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'

    def validate_email(self, value):
        if NewsletterSubscriber.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email sudah terdaftar.")
        return value

class CharmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Charm
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(many=True, queryset=Product.objects.all())

    class Meta:
        model = Order
        fields = '__all__'

    def validate(self, data):
        total = sum([p.price for p in data['products']])
        if total + data.get('shipping_cost', 0) != data['total_price']:
            raise serializers.ValidationError("Total price harus sama dengan total produk + ongkir.")
        return data


class ProductSerializer(serializers.ModelSerializer):
    gift_set_products = serializers.PrimaryKeyRelatedField(many=True, queryset=Product.objects.all(), required=False)

    class Meta:
        model = Product
        fields = '__all__'

    def validate(self, data):
        category = data.get('category', None)
        charms = data.get('charms', [])
        gift_set_products = data.get('gift_set_products', [])

        if category == 'gift_set':
            if not gift_set_products:
                raise serializers.ValidationError("Gift set harus berisi minimal satu produk.")
            for p in gift_set_products:
                if p.category not in ['necklace', 'bracelet', 'earring', 'ring', 'anklet']:
                    raise serializers.ValidationError(f"Produk gift set hanya boleh berisi kategori: necklace, bracelet, earring, ring, anklet.")
        else:
            if gift_set_products:
                raise serializers.ValidationError("Field gift_set_products hanya boleh diisi untuk kategori 'gift_set'.")
            
        return data
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class ReviewSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(many=True, queryset=Product.objects.all())

    class Meta:
        model = Review
        fields = '__all__'

    def validate_products(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("Minimal 1 produk harus direview.")
        return value


    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating harus antara 1 dan 5.")
        return value
    
class CartItemCharmSerializer(serializers.ModelSerializer):
    class Meta: model = CartItemCharm; fields = ['charm_id']

class CartItemSerializer(serializers.ModelSerializer):
    charms = serializers.PrimaryKeyRelatedField(queryset=Charm.objects.all(), many=True)
    class Meta:
        model = CartItem; fields = ['id','product','quantity','charms']

    def validate(self, data):
        product = data.get('product')
        charms = data.get('charms', [])

        if len(charms) > 5:
            raise serializers.ValidationError('Max 5 charms per item.')

        if product:
            if product.category not in ['necklace', 'bracelet'] and charms:
                raise serializers.ValidationError('Charms hanya bisa ditambahkan ke produk kategori necklace atau bracelet.')
        return data

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    class Meta: model = Cart; fields = ['id','items']

class VideoContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoContent
        fields = '__all__'