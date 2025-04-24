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
          console.log('setting currentUser to admin')
          localStorage.setItem('currentUser', 'admin');
        } else {
          console.log('setting current user to ', data.email)
          localStorage.setItem('currentUser', data.email);
        }
        setTimeout(() => {
          this.isLoading = false;
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

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        localStorage.removeItem('currentUser')
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
