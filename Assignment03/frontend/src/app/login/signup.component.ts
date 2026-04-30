import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="max-w-xl mx-auto mt-12 mb-24 animate-in slide-in-from-bottom-8 duration-700">
      <div class="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600"></div>
        
        <div class="text-center mb-10">
          <h2 class="text-3xl font-black text-gray-900 mb-2">Join University Portal</h2>
          <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Credential Registration Portal</p>
        </div>

        <div *ngIf="message()" class="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mb-8 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
           <span class="text-2xl">✅</span>
           <p class="text-emerald-700 text-sm font-bold leading-relaxed">{{ message() }}</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
             <div class="col-span-2 md:col-span-1">
               <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Username</label>
               <input type="text" [(ngModel)]="form.username" name="username" required
                      class="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                      placeholder="e.g. sagar_123">
             </div>
             <div class="col-span-2 md:col-span-1">
               <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Password</label>
               <input type="password" [(ngModel)]="form.password" name="password" required
                      class="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                      placeholder="••••••••">
             </div>
          </div>

          <div>
             <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Select Intended Role</label>
             <div class="flex gap-4">
                <button type="button" (click)="form.roleName = 'Student'" 
                        [class.bg-rose-600]="form.roleName === 'Student'" [class.text-white]="form.roleName === 'Student'"
                        class="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Student</button>
                <button type="button" (click)="form.roleName = 'Faculty'" 
                        [class.bg-orange-500]="form.roleName === 'Faculty'" [class.text-white]="form.roleName === 'Faculty'"
                        class="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Faculty</button>
             </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Full Name</label>
            <input type="text" [(ngModel)]="form.fullName" name="fullName" required
                   class="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                   placeholder="Enter your registered name">
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Department</label>
            <select [(ngModel)]="form.deptName" name="deptName" required
                    class="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-xs">
               <option value="Computer Science">Computer Science</option>
               <option value="IT">Information Technology</option>
               <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Official Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" required
                   class="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                   placeholder="name@wcoe.in">
          </div>

          <button type="submit" [disabled]="loading()"
            class="w-full bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl transform active:scale-95 transition-all flex justify-center items-center uppercase tracking-[0.2em] text-xs">
            <span *ngIf="loading()" class="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-3"></span>
            {{ loading() ? 'Processing Request...' : 'Submit Signup Request' }}
          </button>
          
          <div class="text-center mt-8">
            <a routerLink="/" class="text-xs font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">← Back to Portal Gateway</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SignupComponent {
  form = {
    username: '',
    password: '',
    roleName: 'Student',
    fullName: '',
    email: '',
    deptName: 'Computer Science'
  };

  auth = inject(AuthService);
  router = inject(Router);

  loading = signal(false);
  message = signal('');

  onSubmit() {
    this.loading.set(true);
    this.auth.registerRequest(this.form).subscribe({
      next: (res: any) => {
        this.message.set(res.message);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/']), 5000);
      },
      error: (err) => {
        alert(err.error?.message || 'Submission failed');
        this.loading.set(false);
      }
    });
  }
}
