from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Meal, Category
from .serializers import MealSerializer, CategorySerializer

class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
