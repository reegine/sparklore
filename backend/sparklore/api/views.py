from .services import RajaOngkirService
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Charm, DiscountCampaign, GiftSetOrBundleMonthlySpecial, NewsletterSubscriber, OrderItem, OrderItemCharm, PhotoGallery, Review, Product, Cart, CartItem, Order, VideoContent, PageBanner #Payment
from .serializers import (
    CharmSerializer, DiscountCampaignSerializer, GiftSetOrBundleMonthlySpecialProductSerializer, ProductSerializer,
    CartSerializer, CartItemSerializer,
    OrderSerializer, NewsletterSubscriberSerializer,
    ReviewSerializer, VideoContentSerializer,
    PageBannerSerializer, PhotoGalerySerializer#PaymentSerializer
)
# from .services import MidtransService, RajaOngkirService
from django.db import transaction
from django.utils import timezone

class CharmViewSet(viewsets.ModelViewSet):
    queryset = Charm.objects.all()
    serializer_class = CharmSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category', 'label']
    ordering_fields = ['price', 'rating']

class GiftSetOrBundleMonthlySpecialViewSet(viewsets.ModelViewSet):
    queryset = GiftSetOrBundleMonthlySpecial.objects.all()
    serializer_class = GiftSetOrBundleMonthlySpecialProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category', 'label']
    ordering_fields = ['price', 'rating']

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart, context={'request': request}).data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save(cart=cart)
        if 'charms' in serializer.validated_data:
            item.charms.set(serializer.validated_data['charms'])
        return Response(CartSerializer(cart, context={'request': request}).data, status=status.HTTP_201_CREATED)        

    @action(detail=True, methods=['patch'])
    def update_item(self, request, pk=None):
        item = get_object_or_404(CartItem, pk=pk, cart__user=request.user)
        serializer = CartItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if 'charms' in serializer.validated_data:
            item.charms.set(serializer.validated_data['charms'])
        cart = item.cart
        return Response(CartSerializer(cart, context={'request': request}).data)

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        item = get_object_or_404(CartItem, pk=pk, cart__user=request.user)
        item.delete()
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart, context={'request': request}).data)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user_name', 'products__name']
    ordering_fields = ['rating', 'uploaded_at']

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    cart = Cart.objects.prefetch_related('items__product', 'items__gift_set', 'items__charms').filter(user=request.user).first()
    if not cart or not cart.items.exists():
        return Response({'error': 'Keranjang kosong.'}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        total_price = 0
        order = Order.objects.create(
            user=request.user,
            payment_status='pending',
            fulfillment_status='pending',
            shipping_address=request.data.get('shipping_address', '-'),
            shipping_cost=request.data.get('shipping_cost', 0),
            total_price=0,
        )

        for item in cart.items.all():
            if not item.product and not item.gift_set:
                return Response({'error': 'Item harus berisi produk atau gift set'}, status=400)
            if item.product and item.gift_set:
                return Response({'error': 'Item tidak boleh memiliki dua sumber produk sekaligus'}, status=400)

            if item.product:
                if item.quantity > item.product.stock:
                    return Response({'error': f"Stok tidak cukup untuk produk {item.product.name}"}, status=400)
                item_total = item.product.price * item.quantity
            else:
                item_total = item.gift_set.price * item.quantity

            charm_total = sum([charm.price for charm in item.charms.all()]) * item.quantity
            total_price += item_total + charm_total

            order_item = OrderItem.objects.create(
                order=order,
                product=item.product,
                gift_set=item.gift_set,
                quantity=item.quantity
            )

            for charm in item.charms.all():
                OrderItemCharm.objects.create(order_item=order_item, charm=charm)

            if item.product:
                item.product.stock -= item.quantity
                item.product.sold_stok += item.quantity
                item.product.save()

        order.total_price = total_price + order.shipping_cost
        order.save()

        cart.items.all().delete()

    return Response({
        'message': 'Checkout berhasil',
        'order_id': order.id,
        'total_price': order.total_price
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def direct_checkout(request):
    item_type = request.data.get('type')
    item_id = request.data.get('item_id')
    charms_ids = request.data.get('charms', [])
    quantity = int(request.data.get('quantity', 1))
    shipping_address = request.data.get('shipping_address', '-')
    shipping_cost = float(request.data.get('shipping_cost', 0))

    if item_type not in ['product', 'gift_set', 'charm']:
        return Response({'error': 'Invalid type. Use product, charm, or gift_set.'}, status=400)

    with transaction.atomic():
        total_price = 0
        order = Order.objects.create(
            user=request.user,
            payment_status='pending',
            fulfillment_status='pending',
            shipping_address=shipping_address,
            shipping_cost=shipping_cost,
            total_price=0
        )

        product = None
        gift_set = None

        if item_type == 'product':
            product = get_object_or_404(Product, id=item_id)
            if quantity > product.stock:
                return Response({'error': 'Stok produk tidak mencukupi'}, status=400)
            item_total = product.price * quantity
            product.stock -= quantity
            product.sold_stok += quantity
            product.save()
        elif item_type == 'gift_set':
            gift_set = get_object_or_404(GiftSetOrBundleMonthlySpecial, id=item_id)
            item_total = gift_set.price * quantity
        elif item_type == 'charm':
            charm = get_object_or_404(Charm, id=item_id)
            item_total = charm.price * quantity

        charm_total = 0
        charm_objs = []
        if charms_ids:
            charm_objs = Charm.objects.filter(id__in=charms_ids)
            if len(charm_objs) > 5:
                return Response({'error': 'Maksimal 5 charms'}, status=400)
            if product and not product.charms:
                return Response({'error': 'Produk ini tidak mendukung charms'}, status=400)
            charm_total = sum([charm.price for charm in charm_objs]) * quantity

        order_item = OrderItem.objects.create(
            order=order,
            product=product,
            gift_set=gift_set,
            quantity=quantity
        )

        for charm in charm_objs:
            OrderItemCharm.objects.create(order_item=order_item, charm=charm)

        order.total_price = item_total + charm_total + shipping_cost
        order.save()

    return Response({
        'message': 'Direct checkout berhasil',
        'order_id': order.id,
        'total_price': order.total_price
    }, status=status.HTTP_201_CREATED)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('fulfillment_status')
        rejection_reason = request.data.get('rejection_reason', '')

        if new_status not in dict(Order.FulfillmentStatus.choices):
            return Response({'error': 'Invalid status'}, status=400)

        if new_status == Order.FulfillmentStatus.NOT_ACCEPTED and not rejection_reason:
            return Response({'error': 'Alasan penolakan wajib diisi untuk status not accepted'}, status=400)

        order.fulfillment_status = new_status
        order.rejection_reason = rejection_reason if new_status == Order.FulfillmentStatus.NOT_ACCEPTED else ''
        order.save()

        return Response({'message': f'Status updated to {new_status}'})

class VideoContentViewSet(viewsets.ModelViewSet):
    queryset = VideoContent.objects.all()
    serializer_class = VideoContentSerializer
    permission_classes = [AllowAny]

class PageBannerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PageBanner.objects.all()
    serializer_class = PageBannerSerializer
    permission_classes = [AllowAny]

class PhotoGalleryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PhotoGallery.objects.all()
    serializer_class = PhotoGalerySerializer
    permission_classes = [AllowAny]

class DiscountCampaignViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DiscountCampaign.objects.all()
    serializer_class = DiscountCampaignSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return DiscountCampaign.objects.all()

@api_view(["GET"])
def get_shipping_cost(request):
    origin = "jatibening"
    destination = request.query_params.get("destination")
    weight = request.query_params.get("weight", 1000)  # default 1000 gram

    try:
        result = RajaOngkirService.calculate_shipping_cost(origin, destination, weight)
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
def track_resi(request):
    awb = request.query_params.get("awb")
    courier = request.query_params.get("courier")

    if not awb or not courier:
        return Response({"error": "awb and courier are required"}, status=400)

    try:
        result = RajaOngkirService.track_waybill(awb, courier)
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=400)