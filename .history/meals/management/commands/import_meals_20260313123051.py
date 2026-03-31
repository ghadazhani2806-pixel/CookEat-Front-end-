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

            # -----------------------------
            # CATEGORY
            # -----------------------------
            category_name = item['strCategory']

            category_obj, created = Category.objects.get_or_create(
                name=category_name
            )

            # -----------------------------
            # TITLE
            # -----------------------------
            title = item['strMeal']

            # -----------------------------
            # INSTRUCTIONS → STEPS
            # -----------------------------
            instructions = item['strInstructions']

            # Séparer les phrases pour créer des étapes
            sentences = re.split(r'\.\s+', instructions)

            formatted_steps = ""
            step_number = 1

            for sentence in sentences:
                sentence = sentence.strip()

                if sentence:
                    formatted_steps += f"{step_number}. {sentence}.\n"
                    step_number += 1

            # -----------------------------
            # INGREDIENTS
            # -----------------------------
            ingredients_list = []

            for i in range(1, 21):

                ingredient = item.get(f"strIngredient{i}")
                measure = item.get(f"strMeasure{i}")

                if ingredient and ingredient.strip():

                    ingredient = ingredient.strip()
                    measure = measure.strip() if measure else ""

                    if measure:
                        ingredients_list.append(f"- {ingredient} ({measure})")
                    else:
                        ingredients_list.append(f"- {ingredient}")

            ingredients_text = "\n".join(ingredients_list)

            # -----------------------------
            # VIDEO
            # -----------------------------
            youtube = item['strYoutube']

            # -----------------------------
            # IMAGE
            # -----------------------------
            image = item['strMealThumb']

            # -----------------------------
            # RANDOM PRICE
            # -----------------------------
            price = Decimal(random.randint(8, 25))

            # -----------------------------
            # DESCRIPTION FINAL
            # -----------------------------
            description = f"""Recipe:

Steps:
{formatted_steps}

Ingredients:
{ingredients_text}

Video:
{youtube}
"""

            # -----------------------------
            # CREATE MEAL
            # -----------------------------
            Meal.objects.get_or_create(
                title=title,
                defaults={
                    "description": description,
                    "price": price,
                    "image": image,
                    "category": category_obj
                }
            )

        self.stdout.write(self.style.SUCCESS("Meals imported successfully"))