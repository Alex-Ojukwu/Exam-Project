from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from accounts.permissions import IsManagerOrReadOnly


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for products.
    
    Permissions:
    - Managers: Can create, update, delete products
    - Cashiers: Can only view products
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsManagerOrReadOnly]  # Role-based permission
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'sku', 'barcode']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        # Auto-set created_by to current user
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock (any authenticated user)"""
        low_stock_products = Product.objects.filter(
            stock_quantity__lte=10
        )
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for categories.
    Same permissions as products.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsManagerOrReadOnly]  # Role-based permission