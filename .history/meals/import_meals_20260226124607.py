import requests
from django.core.management.base import BaseCommand
from meals.models import Meal, Category
from decimal import Decimal
from googletrans import Translator
import random


class Command(BaseCommand):
    help = "Import meals and categories from TheMealDB API with French translation"

    def handle(self, *args, **kwargs):

        translator = Translator()

        url = "https://www.themealdb.com/api/json/v1/1/search.php?s="
        response = requests.get(url)
        data = response.json()

        if not data['meals']:
            self.stdout.write(self.style.ERROR("No meals found"))
            return

        for item in data['meals']:

            # ---------------------------
            # Traduction catégorie
            # ---------------------------
            category_name_en = item['strCategory']
            category_name_fr = translator.translate(category_name_en, dest='fr').text

            category_obj, created = Category.objects.get_or_create(
                name=category_name_fr
            )

            # ---------------------------
            # Traduction titre
            # ---------------------------
            title_en = item['strMeal']
            title_fr = translator.translate(title_en, dest='fr').text

            # ---------------------------
            # Traduction instructions
            # ---------------------------
            instructions_en = item['strInstructions']
            instructions_fr = translator.translate(instructions_en, dest='fr').text

            # ---------------------------
            # Ingrédients
            # ---------------------------
            ingredients = []

            for i in range(1, 21):
                ingredient = item.get(f"strIngredient{i}")
                measure = item.get(f"strMeasure{i}")

                if ingredient and ingredient.strip():
                    ingredient_fr = translator.translate(ingredient, dest='fr').text
                    ingredients.append(f"{ingredient_fr} ({measure})")

            ingredients_text = ", ".join(ingredients)

            # ---------------------------
            # Description finale
            # ---------------------------
            youtube = item['strYoutube']
            image = item['strMealThumb']

            description = f"""
            {instructions_fr}

            Ingrédients:
            {ingredients_text}

            Vidéo YouTube:
            {youtube}
            """

            # ---------------------------
            # Prix aléatoire
            # ---------------------------
            price = Decimal(random.randint(8, 25))

            # ---------------------------
            # Création meal
            # ---------------------------
            Meal.objects.create(
                title=title_fr,
                description=description,
                price=price,
                image=image,
                category=category_obj
            )

        self.stdout.write(self.style.SUCCESS("Import terminé avec succès"))