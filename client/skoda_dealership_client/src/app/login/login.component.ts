import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../shared/components/error-dialog/error-dialog.component';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { MongoUser } from '../shared/model/mongo/MongoUser';

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

  constructor(private router: Router, private authService: AuthService, private dialog:MatDialog) { }

  login() {
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (data) => {
        const sessionUser:MongoUser = data.user
        if (sessionUser.email === 'admin@gmail.com' && sessionUser.name === 'admin') {
          console.log('setting currentUser to admin')
          localStorage.setItem('currentUser', 'admin');
        } else {
          console.log('setting current user to ', sessionUser.email)
          localStorage.setItem('currentUser', sessionUser.email);
        }
        setTimeout(() => {
          const dialogRef = this.dialog.open(InfoDialogComponent, {data:'Sikeresen bejelentkeztél!'})
          this.isLoading = false;
        }, 1000);
      },
      error: (err) => {
        setTimeout(() => {
          this.isLoading = false;
          if(err.status === 400) {
            const message = err.error?.message;
            if (message === 'User not found') {
              this.dialog.open(ErrorDialogComponent, { data: 'Ezzel az e-mail címmel még nem regisztráltak!' });
            } else if (message === 'Incorrect password') {
              this.dialog.open(ErrorDialogComponent, { data: 'Helytelen jelszó!' });
            } else {
              this.dialog.open(ErrorDialogComponent, { data: 'Hiba történt a bejelentkezés során.' });
            }          }
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
