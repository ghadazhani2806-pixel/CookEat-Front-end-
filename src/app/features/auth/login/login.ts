import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink]
})
export class LoginComponent {
  email    = '';
  password = '';
  showPass = false;
  errorMsg = '';
  loading  = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.errorMsg = '';
    if (!this.email || !this.password) {
      this.errorMsg = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const ok = this.auth.login(this.email, this.password);
      if (ok) {
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.errorMsg = 'Email ou mot de passe incorrect.';
        this.loading  = false;
      }
    }, 600);
  }
}