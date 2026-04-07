import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface Ingredient {
  name: string;
  quantity: string;
  icon: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

interface Meal {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  difficulty: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: { label: string; value: string; icon: string }[];
  tags: string[];
}

@Component({
  selector: 'app-meal-detail',
  templateUrl: './meal-detail.html',
  styleUrls: ['./meal-detail.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink]
})
export class MealDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ===================== NAVBAR =====================
  navScrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.navScrolled = window.scrollY > 50;
    }
  }

  get isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  logout() { this.auth.logout(); }

  // ===================== MEAL DATA =====================
  meal: Meal | null = null;
  quantity = 1;
  addedToCart = false;
  activeTab = 'ingredients';

  // Mock meals database — replace with API call later
  private allMeals: Meal[] = [
    {
      id: 1,
      name: 'Ramen au poulet',
      category: 'Gourmet',
      price: 28,
      duration: 35,
      difficulty: 'Medium',
      rating: 4.8,
      reviews: 124,
      image: 'assets/images/menu1.jpg',
      description: 'A rich and comforting Japanese ramen with tender chicken, soft-boiled egg, and a deeply flavored broth. Perfect for a cozy evening meal that brings the whole family together.',
      tags: ['Japanese', 'Soup', 'Comfort food', 'Protein-rich'],
      ingredients: [
        { name: 'Chicken breast',    quantity: '300g',   icon: '🍗' },
        { name: 'Ramen noodles',     quantity: '200g',   icon: '🍜' },
        { name: 'Chicken broth',     quantity: '1L',     icon: '🍲' },
        { name: 'Soft-boiled egg',   quantity: '2',      icon: '🥚' },
        { name: 'Spring onions',     quantity: '3 stalks', icon: '🌿' },
        { name: 'Soy sauce',         quantity: '3 tbsp', icon: '🫙' },
        { name: 'Sesame oil',        quantity: '1 tbsp', icon: '🫒' },
        { name: 'Garlic',            quantity: '3 cloves', icon: '🧄' },
        { name: 'Ginger',            quantity: '1 tsp',  icon: '🫚' },
        { name: 'Nori sheets',       quantity: '2',      icon: '🌊' },
      ],
      steps: [
        { number: 1, title: 'Prepare the broth',     duration: '10 min', description: 'In a large pot, heat sesame oil over medium heat. Add garlic and ginger, sauté for 2 minutes until fragrant. Pour in the chicken broth and bring to a simmer.' },
        { number: 2, title: 'Cook the chicken',      duration: '15 min', description: 'Season chicken breast with salt and pepper. Add to the broth and poach for 12–15 minutes until fully cooked. Remove, let cool slightly, then shred or slice.' },
        { number: 3, title: 'Boil the noodles',      duration: '5 min',  description: 'Cook ramen noodles according to package instructions. Drain and set aside.' },
        { number: 4, title: 'Season the broth',      duration: '3 min',  description: 'Add soy sauce to the broth and adjust seasoning with salt to taste. Keep on low heat.' },
        { number: 5, title: 'Assemble the bowls',    duration: '2 min',  description: 'Divide noodles into bowls. Ladle hot broth over noodles. Top with sliced chicken, halved soft-boiled egg, spring onions, and nori sheets.' },
      ],
      nutrition: [
        { label: 'Calories',  value: '480 kcal', icon: '🔥' },
        { label: 'Protein',   value: '38g',      icon: '💪' },
        { label: 'Carbs',     value: '52g',      icon: '🌾' },
        { label: 'Fat',       value: '12g',      icon: '🫒' },
        { label: 'Fiber',     value: '4g',       icon: '🥦' },
        { label: 'Sodium',    value: '890mg',    icon: '🧂' },
      ]
    },
    {
      id: 2,
      name: 'Salade Quinoa',
      category: 'Healthy',
      price: 22,
      duration: 20,
      difficulty: 'Easy',
      rating: 4.6,
      reviews: 89,
      image: 'assets/images/menu2.jpg',
      description: 'A vibrant and nutritious quinoa salad packed with colorful vegetables, fresh herbs, and a tangy lemon dressing. Light yet satisfying, perfect for lunch or a light dinner.',
      tags: ['Healthy', 'Vegetarian', 'Quick', 'Fresh'],
      ingredients: [
        { name: 'Quinoa',          quantity: '200g',  icon: '🌾' },
        { name: 'Cherry tomatoes', quantity: '150g',  icon: '🍅' },
        { name: 'Cucumber',        quantity: '1',     icon: '🥒' },
        { name: 'Red onion',       quantity: '½',     icon: '🧅' },
        { name: 'Fresh parsley',   quantity: '1 bunch', icon: '🌿' },
        { name: 'Lemon',           quantity: '2',     icon: '🍋' },
        { name: 'Olive oil',       quantity: '3 tbsp', icon: '🫒' },
        { name: 'Feta cheese',     quantity: '100g',  icon: '🧀' },
      ],
      steps: [
        { number: 1, title: 'Cook the quinoa',     duration: '15 min', description: 'Rinse quinoa under cold water. Cook in 2x its volume of salted water for 12–15 minutes. Fluff with a fork and let cool.' },
        { number: 2, title: 'Prepare vegetables',  duration: '5 min',  description: 'Halve the cherry tomatoes, dice the cucumber, and finely slice the red onion. Chop the parsley.' },
        { number: 3, title: 'Make the dressing',   duration: '2 min',  description: 'Whisk together lemon juice, olive oil, salt, and pepper.' },
        { number: 4, title: 'Assemble the salad',  duration: '3 min',  description: 'Combine cooled quinoa with all vegetables and parsley. Pour dressing over and toss well. Top with crumbled feta.' },
      ],
      nutrition: [
        { label: 'Calories', value: '320 kcal', icon: '🔥' },
        { label: 'Protein',  value: '14g',      icon: '💪' },
        { label: 'Carbs',    value: '42g',      icon: '🌾' },
        { label: 'Fat',      value: '11g',      icon: '🫒' },
        { label: 'Fiber',    value: '6g',       icon: '🥦' },
        { label: 'Sodium',   value: '380mg',    icon: '🧂' },
      ]
    },
    {
      id: 3,
      name: 'Paella aux fruits de mer',
      category: 'Discovery',
      price: 35,
      duration: 50,
      difficulty: 'Hard',
      rating: 4.9,
      reviews: 67,
      image: 'assets/images/menu3.jpg',
      description: 'An authentic Spanish paella bursting with fresh seafood, saffron-infused rice, and Mediterranean flavors. A showstopper dish perfect for special occasions.',
      tags: ['Spanish', 'Seafood', 'Special occasion', 'Gluten-free'],
      ingredients: [
        { name: 'Short grain rice',  quantity: '300g',  icon: '🍚' },
        { name: 'Mixed seafood',     quantity: '500g',  icon: '🦐' },
        { name: 'Saffron',           quantity: '1 pinch', icon: '🌼' },
        { name: 'Tomatoes',          quantity: '2',     icon: '🍅' },
        { name: 'Bell peppers',      quantity: '2',     icon: '🫑' },
        { name: 'Garlic',            quantity: '4 cloves', icon: '🧄' },
        { name: 'Fish stock',        quantity: '800ml', icon: '🍲' },
        { name: 'Olive oil',         quantity: '4 tbsp', icon: '🫒' },
        { name: 'Lemon',             quantity: '1',     icon: '🍋' },
        { name: 'Fresh parsley',     quantity: '1 bunch', icon: '🌿' },
      ],
      steps: [
        { number: 1, title: 'Prepare the sofrito',  duration: '10 min', description: 'Heat olive oil in a paella pan. Sauté garlic and diced peppers for 5 minutes. Add grated tomatoes and cook until reduced.' },
        { number: 2, title: 'Toast the rice',       duration: '3 min',  description: 'Add rice to the pan and stir to coat with the sofrito for 2–3 minutes.' },
        { number: 3, title: 'Add stock and saffron', duration: '20 min', description: 'Pour in hot fish stock infused with saffron. Spread rice evenly. Do not stir from this point.' },
        { number: 4, title: 'Add the seafood',      duration: '12 min', description: 'Arrange seafood on top of the rice. Cook until seafood is done and rice has absorbed all liquid.' },
        { number: 5, title: 'Rest and serve',       duration: '5 min',  description: 'Remove from heat, cover with foil and rest for 5 minutes. Garnish with lemon wedges and parsley.' },
      ],
      nutrition: [
        { label: 'Calories', value: '560 kcal', icon: '🔥' },
        { label: 'Protein',  value: '42g',      icon: '💪' },
        { label: 'Carbs',    value: '65g',      icon: '🌾' },
        { label: 'Fat',      value: '14g',      icon: '🫒' },
        { label: 'Fiber',    value: '3g',       icon: '🥦' },
        { label: 'Sodium',   value: '720mg',    icon: '🧂' },
      ]
    },
    {
      id: 4, name: 'Tom Yum soupe', category: 'Discovery', price: 25, duration: 30, difficulty: 'Medium', rating: 4.7, reviews: 95,
      image: 'assets/images/menu4.jpg',
      description: 'A bold and aromatic Thai soup with a perfect balance of spicy, sour, and savory flavors.',
      tags: ['Thai', 'Soup', 'Spicy', 'Low-carb'],
      ingredients: [
        { name: 'Shrimp',         quantity: '300g',  icon: '🦐' },
        { name: 'Lemongrass',     quantity: '2 stalks', icon: '🌿' },
        { name: 'Kaffir lime leaves', quantity: '4', icon: '🍃' },
        { name: 'Galangal',       quantity: '3 slices', icon: '🫚' },
        { name: 'Mushrooms',      quantity: '150g',  icon: '🍄' },
        { name: 'Fish sauce',     quantity: '2 tbsp', icon: '🫙' },
        { name: 'Lime juice',     quantity: '3 tbsp', icon: '🍋' },
        { name: 'Chili',          quantity: '2',     icon: '🌶️' },
      ],
      steps: [
        { number: 1, title: 'Make the base',     duration: '8 min',  description: 'Boil water with lemongrass, galangal, and kaffir lime leaves for 5–8 minutes.' },
        { number: 2, title: 'Add mushrooms',     duration: '5 min',  description: 'Add sliced mushrooms and cook for 3 minutes.' },
        { number: 3, title: 'Add shrimp',        duration: '5 min',  description: 'Add shrimp and cook until pink, about 3–4 minutes.' },
        { number: 4, title: 'Season and serve',  duration: '2 min',  description: 'Season with fish sauce, lime juice, and chili. Serve hot.' },
      ],
      nutrition: [
        { label: 'Calories', value: '210 kcal', icon: '🔥' },
        { label: 'Protein',  value: '28g',      icon: '💪' },
        { label: 'Carbs',    value: '12g',      icon: '🌾' },
        { label: 'Fat',      value: '6g',       icon: '🫒' },
        { label: 'Fiber',    value: '2g',       icon: '🥦' },
        { label: 'Sodium',   value: '980mg',    icon: '🧂' },
      ]
    },
    {
      id: 5, name: 'Riz aux haricots', category: 'Healthy', price: 18, duration: 25, difficulty: 'Easy', rating: 4.4, reviews: 56,
      image: 'assets/images/menu5.jpg',
      description: 'A hearty Caribbean-inspired rice and beans dish, simple, filling and full of flavor.',
      tags: ['Caribbean', 'Vegan', 'Budget', 'Filling'],
      ingredients: [
        { name: 'Long grain rice',  quantity: '250g',  icon: '🍚' },
        { name: 'Black beans',      quantity: '400g',  icon: '🫘' },
        { name: 'Coconut milk',     quantity: '200ml', icon: '🥥' },
        { name: 'Garlic',           quantity: '3 cloves', icon: '🧄' },
        { name: 'Thyme',            quantity: '2 sprigs', icon: '🌿' },
        { name: 'Onion',            quantity: '1',     icon: '🧅' },
      ],
      steps: [
        { number: 1, title: 'Sauté aromatics',  duration: '5 min',  description: 'Fry onion and garlic in oil until soft.' },
        { number: 2, title: 'Add beans',        duration: '3 min',  description: 'Add drained black beans and stir.' },
        { number: 3, title: 'Cook rice',        duration: '18 min', description: 'Add rice, coconut milk, water, thyme, salt. Cover and cook until rice is fluffy.' },
      ],
      nutrition: [
        { label: 'Calories', value: '380 kcal', icon: '🔥' },
        { label: 'Protein',  value: '12g',      icon: '💪' },
        { label: 'Carbs',    value: '68g',      icon: '🌾' },
        { label: 'Fat',      value: '8g',       icon: '🫒' },
        { label: 'Fiber',    value: '9g',       icon: '🥦' },
        { label: 'Sodium',   value: '320mg',    icon: '🧂' },
      ]
    },
    {
      id: 6, name: 'Tajine légumes', category: 'Vegetarian', price: 24, duration: 45, difficulty: 'Medium', rating: 4.7, reviews: 78,
      image: 'assets/images/menu6.jpg',
      description: 'A fragrant Moroccan vegetable tagine slow-cooked with warming spices, chickpeas, and dried fruits.',
      tags: ['Moroccan', 'Vegan', 'Spiced', 'Slow-cooked'],
      ingredients: [
        { name: 'Carrots',         quantity: '3',     icon: '🥕' },
        { name: 'Zucchini',        quantity: '2',     icon: '🥒' },
        { name: 'Chickpeas',       quantity: '400g',  icon: '🫘' },
        { name: 'Tomatoes',        quantity: '2',     icon: '🍅' },
        { name: 'Ras el hanout',   quantity: '2 tsp', icon: '🌶️' },
        { name: 'Dried apricots',  quantity: '50g',   icon: '🍑' },
        { name: 'Coriander',       quantity: '1 bunch', icon: '🌿' },
        { name: 'Olive oil',       quantity: '3 tbsp', icon: '🫒' },
      ],
      steps: [
        { number: 1, title: 'Sauté vegetables',   duration: '8 min',  description: 'Heat oil in a tagine or heavy pot. Add carrots and zucchini, cook for 5 minutes.' },
        { number: 2, title: 'Add spices',         duration: '2 min',  description: 'Stir in ras el hanout and cook for 1–2 minutes.' },
        { number: 3, title: 'Add tomatoes',       duration: '5 min',  description: 'Add chopped tomatoes and cook until they break down.' },
        { number: 4, title: 'Slow cook',          duration: '30 min', description: 'Add chickpeas, apricots, and enough water to cover. Simmer on low for 30 minutes.' },
        { number: 5, title: 'Finish and serve',   duration: '2 min',  description: 'Adjust seasoning, garnish with fresh coriander. Serve with couscous.' },
      ],
      nutrition: [
        { label: 'Calories', value: '290 kcal', icon: '🔥' },
        { label: 'Protein',  value: '10g',      icon: '💪' },
        { label: 'Carbs',    value: '44g',      icon: '🌾' },
        { label: 'Fat',      value: '9g',       icon: '🫒' },
        { label: 'Fiber',    value: '11g',      icon: '🥦' },
        { label: 'Sodium',   value: '290mg',    icon: '🧂' },
      ]
    },
    {
      id: 7, name: 'Pasta carbonara', category: 'Gourmet', price: 26, duration: 30, difficulty: 'Easy', rating: 4.8, reviews: 112,
      image: 'assets/images/menu7.jpg',
      description: 'A classic Roman pasta dish with a creamy egg and cheese sauce, crispy pancetta, and freshly cracked black pepper.',
      tags: ['Italian', 'Pasta', 'Classic', 'Quick'],
      ingredients: [
        { name: 'Spaghetti',       quantity: '250g',  icon: '🍝' },
        { name: 'Pancetta',        quantity: '150g',  icon: '🥩' },
        { name: 'Eggs',            quantity: '3',     icon: '🥚' },
        { name: 'Pecorino Romano', quantity: '80g',   icon: '🧀' },
        { name: 'Parmesan',        quantity: '40g',   icon: '🧀' },
        { name: 'Black pepper',    quantity: '2 tsp', icon: '🌶️' },
        { name: 'Garlic',          quantity: '2 cloves', icon: '🧄' },
      ],
      steps: [
        { number: 1, title: 'Cook pasta',          duration: '10 min', description: 'Cook spaghetti in well-salted boiling water until al dente. Reserve 1 cup pasta water.' },
        { number: 2, title: 'Crisp the pancetta',  duration: '8 min',  description: 'Fry pancetta with garlic until golden and crispy. Remove garlic.' },
        { number: 3, title: 'Make the sauce',      duration: '2 min',  description: 'Whisk eggs with grated cheeses and plenty of black pepper.' },
        { number: 4, title: 'Combine',             duration: '3 min',  description: 'Off the heat, toss hot pasta with pancetta, then egg mixture, adding pasta water gradually to create a creamy sauce.' },
      ],
      nutrition: [
        { label: 'Calories', value: '620 kcal', icon: '🔥' },
        { label: 'Protein',  value: '28g',      icon: '💪' },
        { label: 'Carbs',    value: '72g',      icon: '🌾' },
        { label: 'Fat',      value: '24g',      icon: '🫒' },
        { label: 'Fiber',    value: '3g',       icon: '🥦' },
        { label: 'Sodium',   value: '680mg',    icon: '🧂' },
      ]
    },
  ];

  get similarMeals(): Meal[] {
    if (!this.meal) return [];
    return this.allMeals
      .filter(m => m.id !== this.meal!.id && m.category === this.meal!.category)
      .slice(0, 3);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.meal = this.allMeals.find(m => m.id === id) || null;
      if (!this.meal) this.router.navigate(['/']);
      this.quantity = 1;
      this.addedToCart = false;
      this.activeTab = 'ingredients';
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  increment() { this.quantity++; }
  decrement() { if (this.quantity > 1) this.quantity--; }

  addToCart() {
    this.addedToCart = true;
    setTimeout(() => this.addedToCart = false, 2500);
    // TODO: call API
  }

  getDifficultyColor(diff: string): string {
    return diff === 'Easy' ? '#1e4d2b' : diff === 'Medium' ? '#b8860b' : '#d32f2f';
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.round(rating));
  }
}