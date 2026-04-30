import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
      <!-- Sidebar is only visible when logged in -->
      <app-sidebar *ngIf="auth.isLoggedIn()"></app-sidebar>

      <main [class.ml-72]="auth.isLoggedIn()" [class.w-full]="!auth.isLoggedIn()"
            class="flex-grow transition-all duration-300">
        
        <!-- Top Nav (Only when logged in) -->
        <nav *ngIf="auth.isLoggedIn()" class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 px-8 py-4 flex justify-between items-center h-20 shadow-sm border-gray-100">
          <div class="flex items-center gap-4">
            <span class="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">STUDENT INFORMATION SYSTEM v2.0</span>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-right hidden md:block">
              <p class="text-sm font-black text-gray-900 uppercase tracking-tight">{{ auth.user()?.username }}</p>
              <p class="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Member Authenticated</p>
            </div>
            <button (click)="logout()" 
                    class="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 group shadow-sm">
               Sign Out 
               <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </nav>

        <div class="p-4 md:p-10 max-w-[1600px] mx-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
