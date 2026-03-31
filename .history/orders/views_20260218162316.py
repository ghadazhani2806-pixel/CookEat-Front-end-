from rest_framework import viewsets, permissions
from .models import Order, OrderItem
from cart.models import Cart, CartItem
from .serializers import OrderSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['POST'])
    def create_from_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({"error": "Cart is empty."}, status=400)

        order = Order.objects.create(user=request.user)
        for item in cart.items.all():
            OrderItem.objects.create(order=order, meal=item.meal, quantity=item.quantity)
        cart.items.all().delete()  # vider le cart après commande
        serializer = OrderSerializer(order)
        return Response(serializer.data)
