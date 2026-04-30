import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div class="flex flex-wrap justify-center gap-6 mb-12">
        <a routerLink="/login/Admin" class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-xl transition-all active:scale-95 flex items-center gap-2">
          <span class="text-xl">🛡️</span> Admin Login
        </a>
        <a routerLink="/login/Faculty" class="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl transition-all active:scale-95 flex items-center gap-2">
          <span class="text-xl">🎓</span> Faculty Login
        </a>
        <a routerLink="/login/Student" class="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl transition-all active:scale-95 flex items-center gap-2">
          <span class="text-xl">👨‍🎓</span> Student Login
        </a>
      </div>

      <div class="mb-12">
        <a routerLink="/signup" class="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-8 transition-all">
          New Member? Apply for University Portal Access →
        </a>
      </div>

      <div class="bg-white w-full max-w-4xl p-12 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-rose-500"></div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">University Portal</h2>
        <p class="text-gray-500 text-lg">Welcome to Formfilling and Result Processing System</p>
        <div class="mt-8 flex justify-center gap-4 text-xs text-gray-400">
          <span>✔️ Centralized Data</span>
          <span>✔️ Secure RBAC</span>
          <span>✔️ Real-time Reporting</span>
        </div>
      </div>
    </div>
  `
})
export class RoleSelectionComponent { }
