from django.shortcuts import render

# Create your views here.
from .models import User
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions
from .serializers import UserSerializer

User = get_user_model()
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

