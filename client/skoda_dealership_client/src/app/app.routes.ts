import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent)},
    { path: 'car-advertisement-handler', loadComponent: () => import('./car-advertisement-handler/car-advertisement-handler.component').then((c) => c.CarAdvertisementHandlerComponent)},
    { path: 'car-advertisement-management', loadComponent: () =>  import('./car-advertisement-management/car-advertisement-management.component').then((c) => c.CarAdvertisementManagementComponent)},
    { path: 'car-advertisement-viewer', loadComponent: () =>  import('./car-advertisement-viewer/car-advertisement-viewer.component').then((c) => c.CarAdvertisementViewerComponent)},
    { path: 'testdrive-viewer', loadComponent: () =>  import('./testdrive-viewer/testdrive-viewer.component').then((c) => c.TestdriveViewerComponent)},
    { path: 'appointment-viewer', loadComponent: () => import('./appointment-viewer/appointment-viewer.component').then((c) => c.AppointmentViewerComponent)},
    { path: '**', redirectTo: 'login' }
];
