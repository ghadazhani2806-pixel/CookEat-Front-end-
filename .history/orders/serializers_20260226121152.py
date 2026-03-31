from rest_framework import serializers
from .models import Order, OrderItem
from meals.serializers import MealSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    meal = MealSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'meal', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status','total_price', 'created_at', 'items']
