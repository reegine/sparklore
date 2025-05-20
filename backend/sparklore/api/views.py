from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Charm, Product, Cart, CartItem, Order #Payment
from .serializers import (
    CharmSerializer, ProductSerializer,
    CartSerializer, CartItemSerializer,
    OrderSerializer, #PaymentSerializer
)
# from .services import MidtransService, RajaOngkirService
from django.db import transaction

class CharmViewSet(viewsets.ModelViewSet):
    queryset = Charm.objects.all()
    serializer_class = CharmSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category', 'label']
    ordering_fields = ['price', 'rating']

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save(cart=cart)
        item.charms.set(serializer.validated_data['charms'])
        return Response(CartSerializer(cart).data)

    @action(detail=True, methods=['patch'])
    def update_item(self, request, pk=None):
        item = get_object_or_404(CartItem, pk=pk, cart__user=request.user)
        serializer = CartItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if 'charms' in serializer.validated_data:
            item.charms.set(serializer.validated_data['charms'])
        cart = item.cart
        return Response(CartSerializer(cart).data)

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        item = get_object_or_404(CartItem, pk=pk, cart__user=request.user)
        item.delete()
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def checkout(request):
#     cart = get_object_or_404(Cart, user=request.user)
#     if not cart.items.exists():
#         return Response({'error':'Cart kosong'}, status=status.HTTP_400_BAD_REQUEST)
#     with transaction.atomic():
#         total = sum((item.product.price * item.quantity) + sum(c.price for c in item.charms.all())
#                     for item in cart.items.all())
#         # estimate shipping
#         est = RajaOngkirService.estimate_cost(...)
#         shipping_cost = est['rajaongkir']['results'][0]['costs'][0]['cost'][0]['value']
#         order = Order.objects.create(
#             user=request.user, total_price=total, shipping_address=request.data['shipping_address'],
#             shipping_cost=shipping_cost
#         )
#         # Midtrans charge
#         mid = MidtransService.create_transaction(order.id, float(order.total_price+shipping_cost),
#                                                 request.data.get('payment_type','qris'))
#         Payment.objects.create(
#             order=order, transaction_id=mid['transaction_id'], method=mid['payment_type'],
#             amount=mid['gross_amount'], status=mid['transaction_status']
#         )
#         cart.items.all().delete()
#     return Response({'order_id':order.id, 'midtrans':mid})