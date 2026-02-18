from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from meals.models import Meal

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    @action(detail=True, methods=['post'])
    def add_meal(self, request, pk=None):
        cart = self.get_object()
        meal_id = request.data.get("meal_id")
        quantity = request.data.get("quantity", 1)

        meal = Meal.objects.get(id=meal_id)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            meal=meal
        )

        item.quantity += int(quantity)
        item.save()

        return Response({"message": "Meal ajouté au panier"})