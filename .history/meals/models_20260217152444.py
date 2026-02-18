from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=50)

class Meal(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.FloatField()
    image = models.URLField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)