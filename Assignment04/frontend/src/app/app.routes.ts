import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuestionEntryComponent } from './components/question-entry/question-entry.component';
import { ExamTakerComponent } from './components/exam-taker/exam-taker.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'question-entry/:examId', component: QuestionEntryComponent },
    { path: 'take-exam/:id', component: ExamTakerComponent },
    { path: 'reports', component: ReportsComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
