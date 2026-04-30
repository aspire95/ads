import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-8 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Welcome, {{ auth.user()?.username }}!</h2>
          <p class="text-gray-500 font-medium">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              {{ auth.user()?.role }} Portal
            </span>
            Academic Management System — AY 2026-27
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">{{ today | date:'fullDate' }}</p>
        </div>
      </header>

      <!-- ROLE: ADMIN DASHBOARD -->
      <div *ngIf="auth.user()?.role === 'Admin'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl border shadow-sm border-gray-100 flex items-center space-x-4">
          <div class="bg-blue-50 p-3 rounded-xl text-blue-600 font-bold">📂</div>
          <div><p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Departments</p><p class="text-2xl font-black">{{ stats()?.counts?.departments }}</p></div>
        </div>
        <div class="bg-white p-6 rounded-2xl border shadow-sm border-gray-100 flex items-center space-x-4">
          <div class="bg-emerald-50 p-3 rounded-xl text-emerald-600 font-bold">👔</div>
          <div><p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Faculty</p><p class="text-2xl font-black">{{ stats()?.counts?.instructors }}</p></div>
        </div>
        <div class="bg-white p-6 rounded-2xl border shadow-sm border-gray-100 flex items-center space-x-4">
          <div class="bg-orange-50 p-3 rounded-xl text-orange-600 font-bold">🎓</div>
          <div><p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Students</p><p class="text-2xl font-black">{{ stats()?.counts?.students }}</p></div>
        </div>
        <div class="bg-white p-6 rounded-2xl border shadow-sm border-gray-100 flex items-center space-x-4">
          <div class="bg-indigo-50 p-3 rounded-xl text-indigo-600 font-bold">💰</div>
          <div><p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Budget</p><p class="text-2xl font-black">{{ stats()?.totalBudget | currency:'USD' }}</p></div>
        </div>
      </div>

      <!-- ROLE: FACULTY DASHBOARD -->
      <div *ngIf="auth.user()?.role === 'Faculty'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b bg-gray-50/50 flex justify-between items-center">
             <h3 class="font-bold text-gray-800 tracking-tight">Assigned Courses</h3>
             <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{{ stats()?.courses?.length }} Courses</span>
          </div>
          <div class="divide-y divide-gray-100">
            <div *ngFor="let c of stats()?.courses" class="p-6 hover:bg-gray-50 flex items-center justify-between transition-colors">
               <div>
                 <p class="font-bold text-gray-900">{{ c.title }}</p>
                 <p class="text-sm text-gray-400">{{ c.course_id }} • {{ c.semester }} {{ c.year }}</p>
               </div>
               <div class="flex items-center gap-4">
                 <button class="text-blue-600 font-bold text-sm hover:underline">Manage Attendance</button>
                 <button class="text-blue-600 font-bold text-sm hover:underline">Post Grades</button>
               </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-6">
          <div class="bg-emerald-600 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between h-48">
             <p class="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-2">Engaged Students</p>
             <h4 class="text-5xl font-black mb-4">{{ stats()?.totalMyStudents }}</h4>
             <div class="bg-white/10 p-3 rounded-xl text-[10px] font-bold border border-white/20">
               Direct student connection established.
             </div>
          </div>
          <div class="bg-indigo-600 text-white p-8 rounded-2xl shadow-xl h-48 flex flex-col justify-center items-center cursor-pointer group hover:bg-indigo-700 transition-all" routerLink="/tasks">
             <p class="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-2 group-hover:scale-110 transition-transform">Active Assignments</p>
             <h4 class="text-5xl font-black">{{ stats()?.pendingTasks }}</h4>
          </div>
        </div>
      </div>

      <!-- ROLE: STUDENT DASHBOARD -->
      <div *ngIf="auth.user()?.role === 'Student'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Registered Grades</h3>
          <div class="space-y-4">
             <div *ngFor="let g of stats()?.grades" class="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                   <p class="font-bold text-gray-900">{{ g.title }}</p>
                   <p class="text-xs text-gray-500 uppercase font-black">{{ g.semester }} {{ g.year }}</p>
                </div>
                <div class="h-10 w-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-black text-blue-600 shadow-sm">
                   {{ g.grade || 'IP' }}
                </div>
             </div>
          </div>
        </div>
        <div class="flex flex-col gap-6">
          <div class="bg-indigo-700 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center h-56">
             <h4 class="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-2">Total Credits</h4>
             <p class="text-6xl font-black">{{ stats()?.totalCredits }}</p>
             <p class="mt-4 text-indigo-100 text-[10px] font-bold uppercase">Target: 120 Units</p>
          </div>
          <div class="bg-rose-600 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center h-56 cursor-pointer group hover:bg-rose-700 transition-all" routerLink="/tasks">
             <h4 class="text-sm font-bold uppercase tracking-widest text-rose-100 mb-2 group-hover:scale-110 transition-transform">Pending Tasks</h4>
             <p class="text-6xl font-black">{{ stats()?.pendingTasks }}</p>
             <p class="mt-4 text-rose-100 text-[10px] font-bold uppercase">Assigned by Faculty</p>
          </div>
        </div>
      </div>

      <!-- GENERIC QUICK ACTIONS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group" routerLink="/entities">
          <h3 class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Academic Explorer</h3>
          <p class="text-sm text-gray-400 leading-relaxed">View and manage authorized university entities and records.</p>
        </div>
        <div class="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group" routerLink="/reports">
          <h3 class="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Performance Analytics</h3>
          <p class="text-sm text-gray-400 leading-relaxed">Generate detailed reports and export data insights.</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  dataService = inject(DataService);
  today = new Date();
  stats = signal<any>(null);

  ngOnInit() {
    this.dataService.getDashboardStats().subscribe(res => {
      this.stats.set(res);
    });
  }
}
