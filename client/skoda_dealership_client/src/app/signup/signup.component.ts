import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../shared/components/error-dialog/error-dialog.component';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';
  isSigningUp = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    })
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  passwordValidator(control: any) {
    const password = control.value;

    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 8;

    const passwordErrors: any = {};

    if (!hasUpperCase) {
      passwordErrors['uppercase'] = true;
    }
    if (!hasNumber) {
      passwordErrors['number'] = true;
    }
    if (!isValidLength) {
      passwordErrors['length'] = true;
    }

    return Object.keys(passwordErrors).length ? passwordErrors : null;
  }

  phoneNumberValidator(control: any) {
    const phoneNumber = control.value
    if (!phoneNumber) {
      return null;
    }

    const hasPrefix = phoneNumber.startsWith('06');
    const numericPart = phoneNumber.substring(2);
    const isValidLength = numericPart.length >= 6 && numericPart.length <= 8;
    const isNumeric = /^\d+$/.test(numericPart);

    const phoneNumberErrors: any = {};

    if (!hasPrefix) {
      phoneNumberErrors['prefix'] = true;
    }
    if (!isValidLength) {
      phoneNumberErrors['length'] = true;
    }
    if (!isNumeric){
      phoneNumberErrors['numeric'] = true;
    }
    return Object.keys(phoneNumberErrors).length ? phoneNumberErrors : null;
  }

  onSubmit() {
    this.isSigningUp = true;

    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: (data) => {
          console.log(data);
          setTimeout(() => {
            this.isSigningUp = false
            const dialogRef = this.dialog.open(InfoDialogComponent, {data:'Sikeres regisztráció!'})
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigateByUrl('/login');
            });
          }, 1000);
        }, error: (err) => {
          if(err.status === 409) {
            setTimeout(() => {
              const dialogRef = this.dialog.open(ErrorDialogComponent, {data:'Ez az e-mail cím már foglalt!'})
              this.isSigningUp = false;
            }, 1000);
          }
        }
      });
    } else {
      setTimeout(() => {
        this.isSigningUp = false;
        const dialogRef = this.dialog.open(ErrorDialogComponent, {data:'Érvénytelen adatok!'})
      }, 1000);
    }
  }

  goBack() {
    this.location.back();
  }

}
