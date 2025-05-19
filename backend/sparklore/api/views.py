from rest_framework import viewsets, filters
from .models import Charm, Order, Product
from .serializers import CharmSerializer, OrderSerializer, ProductSerializer

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
