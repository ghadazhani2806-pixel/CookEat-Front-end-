import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  status: 'delivered' | 'pending' | 'preparing' | 'cancelled';
  items: OrderItem[];
  deliveryFee: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink]
})
export class OrdersComponent {

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
get deliveredCount(): number { return this.orders.filter(o => o.status === 'delivered').length; }
get pendingCount():   number { return this.orders.filter(o => o.status === 'pending').length; }
get cancelledCount(): number { return this.orders.filter(o => o.status === 'cancelled').length; }

  // ===================== ORDERS =====================
  // Mock data — replace with API call later
  orders: Order[] = [
    {
      id: 1001,
      date: '18/03/2026',
      status: 'delivered',
      deliveryFee: 7,
      items: [
        { name: 'Ramen au poulet', quantity: 2, price: 28 },
        { name: 'Salade Quinoa',   quantity: 1, price: 22 },
      ]
    },
    {
      id: 1002,
      date: '15/03/2026',
      status: 'cancelled',
      deliveryFee: 7,
      items: [
        { name: 'Paella fruits de mer', quantity: 1, price: 35 },
      ]
    },
    {
      id: 1003,
      date: '10/03/2026',
      status: 'delivered',
      deliveryFee: 7,
      items: [
        { name: 'Tom Yum soupe',  quantity: 1, price: 25 },
        { name: 'Tajine légumes', quantity: 2, price: 24 },
      ]
    },
    {
      id: 1004,
      date: '05/03/2026',
      status: 'pending',
      deliveryFee: 7,
      items: [
        { name: 'Pasta carbonara', quantity: 1, price: 26 },
      ]
    },
    {
      id: 1005,
      date: '01/03/2026',
      status: 'preparing',
      deliveryFee: 7,
      items: [
        { name: 'Ramen au poulet', quantity: 1, price: 28 },
      ]
    },
  ];

  // ===================== FILTER =====================
  filterStatus = '';

  get filteredOrders(): Order[] {
    if (!this.filterStatus) return this.orders;
    return this.orders.filter(o => o.status === this.filterStatus);
  }

  // ===================== HELPERS =====================
  getOrderTotal(order: Order): number {
    const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
    return subtotal + order.deliveryFee;
  }

  getOrderSubtotal(order: Order): number {
    return order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  getOrderItemCount(order: Order): number {
    return order.items.reduce((s, i) => s + i.quantity, 0);
  }

  statusLabels: Record<string, string> = {
    delivered: 'Delivered',
    pending:   'Pending',
    preparing: 'Preparing',
    cancelled: 'Cancelled'
  };

  statusIcons: Record<string, string> = {
    delivered: 'fa-circle-check',
    pending:   'fa-clock',
    preparing: 'fa-fire-burner',
    cancelled: 'fa-circle-xmark'
  };

  // expanded order detail
  expandedOrderId: number | null = null;

  toggleOrder(id: number) {
    this.expandedOrderId = this.expandedOrderId === id ? null : id;
  }
}