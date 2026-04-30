import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto mt-24">
      <div class="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-primary mb-2">University Portal</h2>
          <p class="text-gray-500">Sign in as {{ currentRole }} to continue to the University Portal</p>
        </div>
        
        <div *ngIf="errorMessage()" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p class="text-red-700 text-sm font-medium">{{ errorMessage() }}</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input type="text" [(ngModel)]="username" name="username" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              [placeholder]="'Enter ' + currentRole + ' ID'">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••">
          </div>
          <button type="submit" [disabled]="loading()"
            class="w-full bg-primary hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all flex justify-center items-center">
            <span *ngIf="loading()" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
            {{ loading() ? 'Authenticating...' : 'Sign In as ' + currentRole }}
          </button>
          
          <div class="text-center mt-4">
            <a routerLink="/" class="text-sm text-gray-500 hover:text-primary transition-colors">← Back to Role Selection</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  currentRole = 'User';

  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentRole = params['role'] || 'User';
    });
  }

  onSubmit() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.role !== this.currentRole && this.currentRole !== 'User') {
          this.errorMessage.set(`Invalid role! This is the ${this.currentRole} portal.`);
          this.loading.set(false);
          this.auth.logout();
          return;
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
