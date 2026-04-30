import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './login/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntityListComponent } from './entities/entities.component';
import { ReportComponent } from './reports/reports.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { TasksComponent } from './tasks/tasks.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { FeesComponent } from './fees/fees.component';
import { HostelComponent } from './hostel/hostel.component';
import { LibraryComponent } from './library/library.component';
import { ExamsComponent } from './exams/exams.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.isLoggedIn() ? true : router.parseUrl('/');
};

const adminGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.user()?.role === 'Admin' ? true : router.parseUrl('/dashboard');
};

export const routes: Routes = [
    { path: '', component: RoleSelectionComponent },
    { path: 'login/:role', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'entities', component: EntityListComponent, canActivate: [authGuard] },
    { path: 'reports', component: ReportComponent, canActivate: [authGuard] },
    { path: 'approvals', component: ApprovalsComponent, canActivate: [authGuard, adminGuard] },
    { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
    { path: 'attendance', component: AttendanceComponent, canActivate: [authGuard] },
    { path: 'fees', component: FeesComponent, canActivate: [authGuard] },
    { path: 'hostel', component: HostelComponent, canActivate: [authGuard] },
    { path: 'library', component: LibraryComponent, canActivate: [authGuard] },
    { path: 'exams', component: ExamsComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
