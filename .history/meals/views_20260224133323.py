from rest_framework import viewsets
from .models import Meal, Category
from .serializers import MealSerializer, CategorySerializer
from .permissions import IsAdminUserCustom
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    def get_permissions(self):

        if self.request.method in ['POST','PUT','DELETE','PATCH']:
            return [IsAdminUserCustom()]

        return [AllowAny()]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    def get_permissions(self):

        if self.request.method in ['POST','PUT','DELETE','PATCH']:
            return [IsAdminUserCustom()]

        return [AllowAny()]
