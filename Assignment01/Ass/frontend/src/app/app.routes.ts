import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'students', loadComponent: () => import('./components/students/students.component').then(m => m.StudentsComponent) },
    { path: 'departments', loadComponent: () => import('./components/departments/departments.component').then(m => m.DepartmentsComponent) },
    { path: 'users', loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent) },
    { path: 'reports', loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent) },
    { path: '**', redirectTo: 'login' }
];
