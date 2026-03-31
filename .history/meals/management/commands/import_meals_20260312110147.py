import requests
from django.core.management.base import BaseCommand
from meals.models import Meal, Category
from decimal import Decimal
import random
import re

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

            # -----------------------
            # CATEGORY
            # -----------------------
            category_name = item['strCategory']
            category_obj, created = Category.objects.get_or_create(
                name=category_name
            )

            # -----------------------
            # TITLE
            # -----------------------
            title = item['strMeal']

            # -----------------------
            # RECIPE STEPS
            # -----------------------
            instructions = item['strInstructions']

            # Nettoyer les lignes vides et les retours à la ligne multiples
            steps_raw = [line.strip() for line in instructions.split("\n") if line.strip()]

            formatted_steps = ""
            step_number = 1
            current_step = ""

            for line in steps_raw:
                # Si la ligne commence par un chiffre et un point (nouvelle étape)
                if re.match(r"^\d+\.", line):
                    if current_step:
                        # Ajouter l'étape précédente formatée
                        formatted_steps += f"{step_number}: {current_step.strip()}\n"
                        step_number += 1
                    current_step = line
                else:
                    # Sinon, c'est la suite de l'étape actuelle
                    current_step += " " + line

            # Ajouter la dernière étape
            if current_step:
                formatted_steps += f"{step_number}: {current_step.strip()}\n"

            # -----------------------
            # INGREDIENTS
            # -----------------------
            ingredients_list = []
            for i in range(1, 21):
                ingredient = item.get(f"strIngredient{i}")
                measure = item.get(f"strMeasure{i}")
                if ingredient and ingredient.strip():
                    if measure and measure.strip():
                        ingredients_list.append(f"- {ingredient} ({measure})")
                    else:
                        ingredients_list.append(f"- {ingredient}")

            ingredients_text = "\n".join(ingredients_list)

            # -----------------------
            # VIDEO
            # -----------------------
            youtube = item['strYoutube']

            # -----------------------
            # DESCRIPTION FINAL
            # -----------------------
            description = f"""Recette:

{formatted_steps}

Ingrédients:

{ingredients_text}

Vidéo:
{youtube}
"""

            # -----------------------
            # IMAGE
            # -----------------------
            image = item['strMealThumb']

            # -----------------------
            # RANDOM PRICE
            # -----------------------
            price = Decimal(random.randint(8, 25))

            # -----------------------
            # CREATE MEAL
            # -----------------------
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