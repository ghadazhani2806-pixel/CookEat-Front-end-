from rest_framework import viewsets
from .models import Order, OrderItem
from cart.models import Cart
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from core.permissions import IsUserOrAdminReadOnly


class OrderItemViewSet(viewsets.ModelViewSet):

    serializer_class = OrderItemSerializer

    permission_classes = [IsUserOrAdminReadOnly]


    def get_queryset(self):

        return OrderItem.objects.filter(
            order__user=self.request.user
        )




class OrderViewSet(viewsets.ModelViewSet):

    serializer_class = OrderSerializer

    permission_classes = [IsUserOrAdminReadOnly]


    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        )


    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )


    @action(detail=False, methods=['post'])

    def create_from_cart(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )


        if not cart.items.exists():

            return Response(
                {"error": "Cart empty"},
                status=400
            )


        order = Order.objects.create(
            user=request.user
        )


        for item in cart.items.all():

            OrderItem.objects.create(
                order=order,
                meal=item.meal,
                quantity=item.quantity
            )


        cart.items.all().delete()


        serializer = OrderSerializer(order)

        return Response(serializer.data)