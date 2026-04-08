import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink]
})
export class CartComponent {

  constructor(
    private auth: AuthService,
    private router: Router,
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

  logout() { this.auth.logout(); }

  // ===================== CART ITEMS =====================
  items: CartItem[] = [
    { id: 1, name: 'Ramen au poulet',      category: 'Gourmet',    price: 28, quantity: 2, image: 'assets/images/menu1.jpg' },
    { id: 2, name: 'Salade Quinoa',        category: 'Healthy',    price: 22, quantity: 1, image: 'assets/images/menu2.jpg' },
    { id: 3, name: 'Tajine légumes',       category: 'Vegetarian', price: 24, quantity: 1, image: 'assets/images/menu6.jpg' },
  ];

  // ===================== CALCULATIONS =====================
  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get deliveryFee(): number {
    return this.items.length > 0 ? 7 : 0;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // ===================== ACTIONS =====================
  increment(item: CartItem) {
    item.quantity++;
  }

  decrement(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item.id);
    }
  }

  removeItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }

  clearCart() {
    this.items = [];
  }

  // ===================== CHECKOUT =====================
  checkoutDone = false;

  checkout() {
    if (this.items.length === 0) return;
    
    // Sauvegarder les données du panier pour la page de paiement
    localStorage.setItem('cartItems', JSON.stringify(this.items));
    localStorage.setItem('cartSubtotal', this.subtotal.toString());
    localStorage.setItem('cartDeliveryFee', this.deliveryFee.toString());
    localStorage.setItem('cartTotal', this.total.toString());
    
    // Rediriger vers la page de paiement
    this.router.navigate(['/payment']);
  }
}