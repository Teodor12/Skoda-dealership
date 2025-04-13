import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CarAdvertisementHandlerComponent } from './car-advertisement-handler/car-advertisement-handler.component';
import { CarAdvertisementManagementComponent } from './car-advertisement-management/car-advertisement-management.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SignupComponent, CarAdvertisementHandlerComponent, CarAdvertisementManagementComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-first-project test';
}
