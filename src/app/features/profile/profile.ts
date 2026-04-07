import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface Order {
  id: number;
  meal: string;
  date: string;
  price: number;
  status: 'delivered' | 'pending' | 'preparing' | 'cancelled';
}

interface FavoriteMeal {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface Activity {
  icon: string;
  text: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink]
})
export class ProfileComponent {

  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.name  = user.name;
      this.email = user.email;
    }
  }

  // ===================== NAVBAR =====================
  navScrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.navScrolled = window.scrollY > 50;
    }
  }

  // ===================== TABS =====================
  activeTab = 'info';
  setTab(tab: string) { this.activeTab = tab; }

  // ===================== PERSONAL INFO =====================
  name        = '';
  email       = '';
  phone       = '';
  address     = '';
  editingInfo = false;
  saveInfo()  { this.editingInfo = false; /* TODO: API */ }

  // ===================== AVATAR =====================
  avatarUrl: string | null = null;

  get userInitial(): string {
    return this.name ? this.name.charAt(0).toUpperCase() : 'U';
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => { this.avatarUrl = e.target?.result as string; };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // ===================== PASSWORD =====================
  currentPassword = '';
  newPassword     = '';
  confirmPassword = '';
  showCurrentPass = false;
  showNewPass     = false;
  passwordMsg     = '';
  passwordError   = false;

  savePassword() {
    this.passwordMsg = ''; this.passwordError = false;
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordMsg = 'Please fill in all fields.'; this.passwordError = true; return;
    }
    if (this.newPassword.length < 6) {
      this.passwordMsg = 'Password must be at least 6 characters.'; this.passwordError = true; return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMsg = 'Passwords do not match.'; this.passwordError = true; return;
    }
    this.passwordMsg = 'Password updated successfully!';
    this.currentPassword = ''; this.newPassword = ''; this.confirmPassword = '';
  }

  // ===================== ORDERS =====================
  orders: Order[] = [
    { id: 1, meal: 'Ramen au poulet',      date: '18/03/2026', price: 28, status: 'delivered' },
    { id: 2, meal: 'Salade Quinoa',        date: '17/03/2026', price: 22, status: 'delivered' },
    { id: 3, meal: 'Paella fruits de mer', date: '15/03/2026', price: 35, status: 'cancelled' },
    { id: 4, meal: 'Tom Yum soupe',        date: '10/03/2026', price: 25, status: 'delivered' },
    { id: 5, meal: 'Tajine légumes',       date: '05/03/2026', price: 24, status: 'pending'   },
  ];

  statusLabels: Record<string, string> = {
    delivered: 'Delivered', pending: 'Pending',
    preparing: 'Preparing', cancelled: 'Cancelled'
  };

  get deliveredCount(): number { return this.orders.filter(o => o.status === 'delivered').length; }
  get totalSpent(): number     { return this.orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.price, 0); }

  // ===================== FAVORITES =====================
  favorites: FavoriteMeal[] = [
    { id: 1, name: 'Ramen au poulet',      category: 'Gourmet',    price: 28, image: 'assets/images/menu1.jpg' },
    { id: 2, name: 'Salade Quinoa',        category: 'Healthy',    price: 22, image: 'assets/images/menu2.jpg' },
    { id: 3, name: 'Tajine légumes',       category: 'Vegetarian', price: 24, image: 'assets/images/menu6.jpg' },
    { id: 4, name: 'Tom Yum soupe',        category: 'Discovery',  price: 25, image: 'assets/images/menu4.jpg' },
  ];

  removeFavorite(id: number) { this.favorites = this.favorites.filter(f => f.id !== id); }

  // ===================== ACTIVITY =====================
  activities: Activity[] = [
    { icon: 'fa-box',        text: 'Order #1 delivered — Ramen au poulet',   time: '2 hours ago',   color: '#1e4d2b' },
    { icon: 'fa-heart',      text: 'Added Salade Quinoa to favorites',        time: '1 day ago',     color: '#b8860b' },
    { icon: 'fa-star',       text: 'You rated Tom Yum soupe 5 stars',         time: '3 days ago',    color: '#1a73e8' },
    { icon: 'fa-cart-plus',  text: 'Added Paella fruits de mer to cart',      time: '5 days ago',    color: '#2d6a4f' },
    { icon: 'fa-box',        text: 'Order #3 cancelled — Paella fruits de mer', time: '6 days ago',  color: '#d32f2f' },
  ];

  // ===================== LOGOUT =====================
  logout() { this.auth.logout(); }
}