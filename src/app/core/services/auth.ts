import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private mockUsers: User[] = [
    { id: 1, name: 'Admin CookEat', email: 'admin@cookeat.tn',   role: 'admin' },
    { id: 2, name: 'Chaima',        email: 'chaima@cookeat.tn',  role: 'user'  },
    { id: 3, name: 'Youssef',       email: 'youssef@cookeat.tn', role: 'user'  },
  ];

  private mockPasswords: Record<string, string> = {
    'admin@cookeat.tn':   'admin123',
    'chaima@cookeat.tn':  'user123',
    'youssef@cookeat.tn': 'user123',
  };

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object  // ✅ inject platform
  ) {}

  // ✅ Safe localStorage getter
  private getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  // ✅ Safe localStorage setter
  private setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  // ✅ Safe localStorage remover
  private removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  login(email: string, password: string): boolean {
    const correctPassword = this.mockPasswords[email];
    const user = this.mockUsers.find(u => u.email === email);
    if (user && correctPassword === password) {
      this.setItem('cookit_token', 'mock_token_' + user.id);
      this.setItem('cookit_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const exists = this.mockUsers.find(u => u.email === email);
    if (exists) return false;
    const newUser: User = {
      id:   this.mockUsers.length + 1,
      name,
      email,
      role: 'user'
    };
    this.mockUsers.push(newUser);
    this.mockPasswords[email] = password;
    this.setItem('cookit_token', 'mock_token_' + newUser.id);
    this.setItem('cookit_user', JSON.stringify(newUser));
    return true;
  }

  logout(): void {
    this.removeItem('cookit_token');
    this.removeItem('cookit_user');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.getItem('cookit_token');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    const data = this.getItem('cookit_user');
    return data ? JSON.parse(data) : null;
  }
}