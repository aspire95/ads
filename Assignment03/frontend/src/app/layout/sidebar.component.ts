import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside [class.w-72]="isOpen()" [class.w-20]="!isOpen()" 
           class="bg-slate-900 text-slate-300 h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-50 shadow-2xl">
      
      <!-- Brand Header -->
      <div class="p-6 border-b border-white/5 flex items-center justify-between overflow-hidden">
        <h1 *ngIf="isOpen()" class="text-white font-black tracking-tighter text-xl whitespace-nowrap">{{ getTitle() }}</h1>
        <button (click)="toggle()" class="p-2 hover:bg-white/10 rounded-xl transition-colors">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-grow py-6 overflow-y-auto custom-scrollbar">
        <ul class="space-y-1 px-3">
          <ng-container *ngFor="let item of menuItems">
            <li *ngIf="item.roles.includes(auth.user()?.role || '')">
              <a [routerLink]="item.path" routerLinkActive="bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                 class="group flex items-center p-3 rounded-xl hover:bg-white/5 hover:text-white transition-all">
                <span class="text-xl shrink-0">{{ item.icon }}</span>
                <span *ngIf="isOpen()" class="ml-4 font-bold text-sm tracking-wide">{{ item.label }}</span>
                <span *ngIf="!isOpen()" class="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">{{ item.label }}</span>
              </a>
            </li>
          </ng-container>
        </ul>
      </nav>

      <!-- Footer Info -->
      <div class="p-4 border-t border-white/5 bg-black/20">
         <div *ngIf="isOpen()" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
               {{ auth.user()?.username?.[0]?.toUpperCase() }}
            </div>
            <div class="overflow-hidden">
               <p class="text-xs font-black text-white truncate uppercase">{{ auth.user()?.username }}</p>
               <p class="text-[10px] text-gray-400 font-bold truncate">{{ auth.user()?.role }} Portal</p>
            </div>
         </div>
      </div>
    </aside>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  `]
})
export class SidebarComponent {
  auth = inject(AuthService);
  isOpen = signal(true);

  getTitle(): string {
    const role = this.auth.user()?.role?.toUpperCase();
    if (role === 'ADMIN') return 'ADMIN MIS';
    if (role === 'FACULTY') return 'TEACHER MIS';
    return 'STUDENT MIS';
  }

  menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠', roles: ['Admin', 'Faculty', 'Student'] },
    { label: 'Academic Explorer', path: '/entities', icon: '📂', roles: ['Admin', 'Faculty', 'Student'] },
    { label: 'Strategic Reports', path: '/reports', icon: '📊', roles: ['Admin', 'Faculty'] },
    { label: 'Assignments', path: '/tasks', icon: '📝', roles: ['Faculty', 'Student'] },
    { label: 'Approvals', path: '/approvals', icon: '🛡️', roles: ['Admin'] },

    // Feature Module Mock Paths (Can be expanded)
    { label: 'Attendance', path: '/attendance', icon: '📝', roles: ['Faculty', 'Student'] },
    { label: 'Fee Management', path: '/fees', icon: '💸', roles: ['Admin', 'Student'] },
    { label: 'Hostel Services', path: '/hostel', icon: '🏢', roles: ['Admin', 'Student'] },
    { label: 'Library Digitization', path: '/library', icon: '📚', roles: ['Student'] },
    { label: 'Exam Hall Tickets', path: '/exams', icon: '🎟️', roles: ['Student'] }
  ];

  toggle() {
    this.isOpen.update(v => !v);
  }
}
