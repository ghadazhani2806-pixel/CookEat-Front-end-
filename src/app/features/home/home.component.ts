import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { RouterLink,Router  } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule]
})
export class HomeComponent implements AfterViewInit {

  constructor(
  @Inject(PLATFORM_ID) private platformId: Object,
  private auth: AuthService,
  private router: Router
) {}
  // ===================== AUTH =====================
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  //--get-meal
  navigateToMeal(id: number) {
  this.router.navigate(['/meal', id]);
}

  // ===================== TESTIMONIALS =====================
  testimonials: { text: string; name: string; avatar?: string }[] = [
    {
      text: "I made the ramen tonight… delicious! Everyone loved it. And best of all, tonight when I asked what they wanted for dinner, everyone participated.",
      name: "Chazz",
      avatar: "assets/avatars/chazz.jpg"
    },
    {
      text: "Hello, I tried the Ramen and Quinoa salad. It's very good, generous portions. The recipe is clear and easy to follow. Well done!",
      name: "Chaima",
      avatar: "assets/avatars/chaima.jpg"
    },
    {
      text: "Fast delivery and fresh ingredients. Very satisfied!",
      name: "Sarra",
      avatar: "assets/avatars/sarra.jpg"
    },
    {
      text: "Great concept for saving time during the week.",
      name: "Youssef",
      avatar: "assets/avatars/youssef.jpg"
    }
  ];
  currentIndex = 0;

  next() { this.currentIndex = (this.currentIndex + 1) % this.testimonials.length; }
  prev() { this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length; }
  // ===================== SEARCH =====================
searchQuery   = '';
searchResults: { id: number; src: string; name: string }[] = [];
searchDone    = false;

onSearch() {
  this.searchDone = true;
  if (!this.searchQuery.trim()) {
    this.searchResults = [];
    return;
  }
  const q = this.searchQuery.toLowerCase();
  this.searchResults = this.menuImages.filter(m =>
    m.name.toLowerCase().includes(q)
  );
}

  // ===================== CAROUSEL =====================
 menuImages: { id: number; src: string; name: string }[] = [
  { id: 1, src: 'assets/images/menu1.jpg', name: 'Ramen au poulet' },
  { id: 2, src: 'assets/images/menu2.jpg', name: 'Salade Quinoa' },
  { id: 3, src: 'assets/images/menu3.jpg', name: 'Paella aux fruits de mer' },
  { id: 4, src: 'assets/images/menu4.jpg', name: 'Tom Yum soupe' },
  { id: 5, src: 'assets/images/menu5.jpg', name: 'Riz aux haricots' },
  { id: 6, src: 'assets/images/menu6.jpg', name: 'Tajine légumes' },
  { id: 7, src: 'assets/images/menu7.jpg', name: 'Pasta carbonara' },
];
  carouselIndex = 0;
  visibleCount  = 7;

 getVisibleImages(): { id: number; src: string; name: string }[] {
  const result: { id: number; src: string; name: string }[] = [];
  for (let i = 0; i < this.visibleCount; i++) {
    result.push(this.menuImages[(this.carouselIndex + i) % this.menuImages.length]);
  }
  return result;
}

  nextSlide() { this.carouselIndex = (this.carouselIndex + 1) % this.menuImages.length; }
  prevSlide() { this.carouselIndex = (this.carouselIndex - 1 + this.menuImages.length) % this.menuImages.length; }

  // ===================== SCROLL =====================
  showGoToTop = false;
  navScrolled = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showGoToTop = window.scrollY > 500;
      this.navScrolled = window.scrollY > 50;
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const elements = document.querySelectorAll('.fade-in');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('show');
        });
      }, { threshold: 0.1 });
      elements.forEach(el => observer.observe(el));
    }
  }
}