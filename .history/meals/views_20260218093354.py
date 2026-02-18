from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Meal, Category
from .serializers import MealSerializer, CategorySerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @action(detail=True, methods=['get'])
    def meals(self, request, pk=None):
        category = self.get_object()
        meals = category.meal_set.all()
        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)
