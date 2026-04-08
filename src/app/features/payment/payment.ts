import { Component, OnInit, ViewChild, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrls: ['./payment.css'],
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, StripeCardComponent]
})
export class PaymentComponent implements OnInit {

  @ViewChild(StripeCardComponent)
  card!: StripeCardComponent;

  constructor(
    private auth: AuthService,
    private router: Router,
    private stripe: StripeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  navScrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.navScrolled = window.scrollY > 50;
    }
  }

  logout() { this.auth.logout(); }

  orderItems: { name: string; quantity: number; price: number }[] = [];
  deliveryFee = 7;
  subtotal = 0;
  total = 0;

  // Options pour la carte Stripe
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'fr'
  };

  paying = false;
  paymentOk = false;
  errorMsg = '';

  ngOnInit() {
    console.log('🔵 PaymentComponent initialisé');
    
    const savedItems = localStorage.getItem('cartItems');
    const savedSubtotal = localStorage.getItem('cartSubtotal');
    const savedDeliveryFee = localStorage.getItem('cartDeliveryFee');
    
    if (savedItems) {
      const items: CartItem[] = JSON.parse(savedItems);
      this.orderItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
    }
    
    if (savedSubtotal) this.subtotal = parseFloat(savedSubtotal);
    if (savedDeliveryFee) this.deliveryFee = parseFloat(savedDeliveryFee);
    
    this.total = this.subtotal + this.deliveryFee;
    
    if (this.orderItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    
    console.log('💰 Total:', this.total, 'DT');
    console.log('💳 StripeCardComponent va s\'afficher');
  }

  async pay() {
    if (this.paying) return;
    
    this.paying = true;
    this.errorMsg = '';

    // Mode démo - simulation de paiement réussi
    console.log('🟢 MODE DÉMO: Paiement simulé');
    
    setTimeout(() => {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartSubtotal');
      localStorage.removeItem('cartDeliveryFee');
      localStorage.removeItem('cartTotal');
      
      this.paymentOk = true;
      this.paying = false;
      
      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 2000);
    }, 1500);
  }
}