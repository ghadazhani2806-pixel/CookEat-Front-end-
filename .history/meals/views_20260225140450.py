from rest_framework import viewsets
from .models import Meal, Category
from .serializers import MealSerializer, CategorySerializer
from core.permissions import IsAdminOrReadOnly


class MealViewSet(viewsets.ModelViewSet):

    queryset = Meal.objects.all()

    serializer_class = MealSerializer

    permission_classes = [IsAdminOrReadOnly]



class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [IsAdminOrReadOnly]