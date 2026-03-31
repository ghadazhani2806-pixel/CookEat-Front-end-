import requests
from django.core.management.base import BaseCommand
from meals.models import Meal, Category
from decimal import Decimal
import random


class Command(BaseCommand):
    help = "Import meals and categories from TheMealDB API"

    def handle(self, *args, **kwargs):

        url = "https://www.themealdb.com/api/json/v1/1/search.php?s="
        response = requests.get(url)
        data = response.json()

        if not data['meals']:
            self.stdout.write(self.style.ERROR("No meals found"))
            return

        for item in data['meals']:

            # Catégorie
            category_name = item['strCategory']

            category_obj, created = Category.objects.get_or_create(
                name=category_name
            )

            # Titre
            title = item['strMeal']

            # Instructions
            instructions = item['strInstructions']

            # Ingrédients
            ingredients = []

            for i in range(1, 21):
                ingredient = item.get(f"strIngredient{i}")
                measure = item.get(f"strMeasure{i}")

                if ingredient and ingredient.strip():
                    ingredients.append(f"{ingredient} ({measure})")

            ingredients_text = ", ".join(ingredients)

            # Description complète
            youtube = item['strYoutube']
            image = item['strMealThumb']

            description = f"""
            {instructions}

            Ingredients:
            {ingredients_text}

            YouTube:
            {youtube}
            """

            price = Decimal(random.randint(8, 25))

            Meal.objects.get_or_create(
                title=title,
                defaults={
                    "description": description,
                    "price": price,
                    "image": image,
                    "category": category_obj
                }
            )

        self.stdout.write(self.style.SUCCESS("Import terminé avec succès"))