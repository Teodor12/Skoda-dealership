import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../shared/model/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) { }

  login() {
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (data: User) => {
        if (data.email === 'admin@gmail.com' && data.name === 'admin') {
          localStorage.setItem('currentUser', 'admin');
        } else {
          localStorage.setItem('currentUser', data.email);
        }
        setTimeout(() => {
          this.isLoading = false;
          console.log('admin is logged in');
        }, 1000);
      },
      error: (err) => {
        setTimeout(() => {
          this.isLoading = false;
          this.errorMessage = err.message;
        }, 1000);
      }
    });
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
