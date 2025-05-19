from rest_framework import serializers
from .models import Charm, Product, Order, Review, NewsletterSubscriber

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
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
    charms = serializers.PrimaryKeyRelatedField(many=True, queryset=Charm.objects.all(), required=False)
    charms_detail = CharmSerializer(many=True, source="charms", read_only=True)
    gift_set_products = serializers.PrimaryKeyRelatedField(many=True, queryset=Product.objects.all(), required=False)

    class Meta:
        model = Product
        fields = '__all__'

    def validate_charms(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("Maksimal hanya bisa memilih 5 charms per produk.")
        return value

    def validate(self, data):
        category = data.get('category', None)
        charms = data.get('charms', [])
        gift_set_products = data.get('gift_set_products', [])

        # VALIDASI CHARMS
        if category not in ['necklace', 'bracelet'] and charms:
            raise serializers.ValidationError("Charms hanya diperbolehkan untuk produk berjenis 'necklace' atau 'bracelet'.")

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