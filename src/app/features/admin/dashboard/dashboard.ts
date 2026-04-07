import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

interface Category {
  id: number;
  name: string;
  description: string;
  mealsCount: number;
}

interface Meal {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  available: boolean;
}

interface Order {
  id: number;
  client: string;
  meal: string;
  date: string;
  status: 'delivered' | 'pending' | 'preparing' | 'cancelled';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule]
})
export class DashboardComponent {

  constructor(private auth: AuthService, private router: Router) {}

  // ===================== NAV =====================
  activeSection = 'overview';

  setSection(section: string) {
    this.activeSection = section;
    this.resetAllForms();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  // ===================== NAVBAR =====================
showNotif = false;

notifications = [
  'New order #7 received',
  'Meal "Tajine" stock low',
  'New user registered',
];

toggleNotif() { this.showNotif = !this.showNotif; }

clearNotifications() { this.notifications = []; }

get currentUserName(): string {
  return this.auth.getCurrentUser()?.name || 'Admin';
}

get currentUserInitial(): string {
  return this.currentUserName.charAt(0).toUpperCase();
}

  // ===================== OVERVIEW =====================
  orders: Order[] = [
    { id: 1, client: 'Chaima B.',   meal: 'Ramen au poulet',        date: '18/03/2026', status: 'delivered'  },
    { id: 2, client: 'Youssef M.',  meal: 'Paella fruits de mer',   date: '18/03/2026', status: 'pending'    },
    { id: 3, client: 'Sarra K.',    meal: 'Salade Quinoa',          date: '17/03/2026', status: 'preparing'  },
    { id: 4, client: 'Chazz T.',    meal: 'Tom Yum soupe',          date: '17/03/2026', status: 'cancelled'  },
    { id: 5, client: 'Amine R.',    meal: 'Tajine légumes',         date: '16/03/2026', status: 'delivered'  },
    { id: 6, client: 'Lina S.',     meal: 'Pasta carbonara',        date: '16/03/2026', status: 'pending'    },
  ];
  get pendingCount(): number {
  return this.orders.filter(o => o.status === 'pending').length;
}

  statusLabels: Record<string, string> = {
    delivered: 'Delivered',
    pending:   'Pending',
    preparing: 'Preparing',
    cancelled: 'Cancelled'
  };

  // ===================== CATEGORIES =====================
  categories: Category[] = [
    { id: 1, name: 'Healthy',    description: 'Light and balanced recipes',    mealsCount: 8 },
    { id: 2, name: 'Gourmet',    description: 'Rich and flavorful recipes',    mealsCount: 6 },
    { id: 3, name: 'Discovery',  description: 'World cuisines and novelties',  mealsCount: 5 },
    { id: 4, name: 'Vegetarian', description: 'Meat-free, full of flavors',    mealsCount: 4 },
    { id: 5, name: 'Quick',      description: 'Ready in less than 20 minutes', mealsCount: 7 },
  ];

  showCategoryForm  = false;
  isEditingCategory = false;
  categoryForm: Partial<Category> = {};
  deleteCategoryId: number | null = null;
  searchCategory = '';

  get filteredCategories(): Category[] {
    const q = this.searchCategory.toLowerCase();
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  openAddCategory() {
    this.isEditingCategory = false;
    this.categoryForm = { name: '', description: '' };
    this.showCategoryForm = true;
  }

  openEditCategory(cat: Category) {
    this.isEditingCategory = true;
    this.categoryForm = { ...cat };
    this.showCategoryForm = true;
  }

  saveCategory() {
    if (!this.categoryForm.name?.trim()) return;
    if (this.isEditingCategory) {
      const idx = this.categories.findIndex(c => c.id === this.categoryForm.id);
      if (idx !== -1) this.categories[idx] = { ...this.categories[idx], ...this.categoryForm } as Category;
    } else {
      const newId = Math.max(...this.categories.map(c => c.id)) + 1;
      this.categories.push({ id: newId, name: this.categoryForm.name!, description: this.categoryForm.description || '', mealsCount: 0 });
    }
    this.resetAllForms();
  }

  confirmDeleteCategory(id: number) { this.deleteCategoryId = id; }

  deleteCategory() {
    this.categories = this.categories.filter(c => c.id !== this.deleteCategoryId);
    this.deleteCategoryId = null;
  }

  // ===================== MEALS =====================
  meals: Meal[] = [
    { id: 1, name: 'Ramen au poulet',      category: 'Gourmet',    price: 28, duration: 35, difficulty: 'Medium', image: 'assets/images/menu1.jpg', available: true  },
    { id: 2, name: 'Salade Quinoa',        category: 'Healthy',    price: 22, duration: 20, difficulty: 'Easy',   image: 'assets/images/menu2.jpg', available: true  },
    { id: 3, name: 'Paella fruits de mer', category: 'Discovery',  price: 35, duration: 50, difficulty: 'Hard',   image: 'assets/images/menu3.jpg', available: true  },
    { id: 4, name: 'Tom Yum soupe',        category: 'Discovery',  price: 25, duration: 30, difficulty: 'Medium', image: 'assets/images/menu4.jpg', available: false },
    { id: 5, name: 'Riz aux haricots',     category: 'Healthy',    price: 18, duration: 25, difficulty: 'Easy',   image: 'assets/images/menu5.jpg', available: true  },
    { id: 6, name: 'Tajine légumes',       category: 'Vegetarian', price: 24, duration: 45, difficulty: 'Medium', image: 'assets/images/menu6.jpg', available: true  },
    { id: 7, name: 'Pasta carbonara',      category: 'Gourmet',    price: 26, duration: 30, difficulty: 'Easy',   image: 'assets/images/menu7.jpg', available: false },
  ];

  categoryOptions  = ['Healthy', 'Gourmet', 'Discovery', 'Vegetarian', 'Quick'];
  difficultyOptions: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];

  showMealForm    = false;
  isEditingMeal   = false;
  mealForm: Partial<Meal> = {};
  deleteMealId: number | null = null;
  searchMeal     = '';
  filterCategory = '';

  get filteredMeals(): Meal[] {
    return this.meals.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(this.searchMeal.toLowerCase());
      const matchCat    = this.filterCategory ? m.category === this.filterCategory : true;
      return matchSearch && matchCat;
    });
  }

  openAddMeal() {
    this.isEditingMeal = false;
    this.mealForm = { name: '', category: '', price: 0, duration: 30, difficulty: 'Easy', image: '', available: true };
    this.showMealForm = true;
  }

  openEditMeal(meal: Meal) {
    this.isEditingMeal = true;
    this.mealForm = { ...meal };
    this.showMealForm = true;
  }

  saveMeal() {
    if (!this.mealForm.name?.trim() || !this.mealForm.category) return;
    if (this.isEditingMeal) {
      const idx = this.meals.findIndex(m => m.id === this.mealForm.id);
      if (idx !== -1) this.meals[idx] = { ...this.meals[idx], ...this.mealForm } as Meal;
    } else {
      const newId = Math.max(...this.meals.map(m => m.id)) + 1;
      this.meals.push({ id: newId, name: this.mealForm.name!, category: this.mealForm.category!, price: this.mealForm.price || 0, duration: this.mealForm.duration || 30, difficulty: this.mealForm.difficulty || 'Easy', image: this.mealForm.image || '', available: this.mealForm.available ?? true });
    }
    this.resetAllForms();
  }

  toggleAvailability(meal: Meal) { meal.available = !meal.available; }
  confirmDeleteMeal(id: number)  { this.deleteMealId = id; }
  deleteMeal() {
    this.meals = this.meals.filter(m => m.id !== this.deleteMealId);
    this.deleteMealId = null;
  }

  // ===================== ORDERS =====================
  searchOrder   = '';
  filterStatus  = '';

  get filteredOrders(): Order[] {
    return this.orders.filter(o => {
      const matchSearch = o.client.toLowerCase().includes(this.searchOrder.toLowerCase()) || o.meal.toLowerCase().includes(this.searchOrder.toLowerCase());
      const matchStatus = this.filterStatus ? o.status === this.filterStatus : true;
      return matchSearch && matchStatus;
    });
  }

  updateStatus(order: Order, status: Order['status']) {
    order.status = status;
  }

  // ===================== RESET =====================
  resetAllForms() {
    this.showCategoryForm  = false;
    this.isEditingCategory = false;
    this.categoryForm      = {};
    this.deleteCategoryId  = null;
    this.showMealForm      = false;
    this.isEditingMeal     = false;
    this.mealForm          = {};
    this.deleteMealId      = null;
  }
}
// à changer (back-end)