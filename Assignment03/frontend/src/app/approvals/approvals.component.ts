import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-approvals',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <header class="bg-indigo-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-10 opacity-10 text-9xl">🛡️</div>
        <div class="relative z-10">
           <h2 class="text-3xl font-black tracking-tight mb-2">Registration Governance</h2>
           <p class="text-indigo-200 font-bold text-sm uppercase tracking-[0.2em]">Pending Access Requests Gatekeeper</p>
        </div>
      </header>

      <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 border-b bg-gray-50/50 flex justify-between items-center">
           <h3 class="font-black text-gray-800 text-xs uppercase tracking-widest">Pending Verification Queue</h3>
           <span class="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{{ requests().length }} Requests</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <th class="px-8 py-6">Requested Username</th>
                <th class="px-8 py-6">Full Name & Dept</th>
                <th class="px-8 py-6">Role Aimed</th>
                <th class="px-8 py-6">Created on</th>
                <th class="px-8 py-6 text-right">Strategic Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let req of requests()" class="hover:bg-indigo-50/30 transition-all group">
                <td class="px-8 py-6 font-black text-gray-900">{{ req.username }}</td>
                <td class="px-8 py-6">
                   <p class="font-bold text-gray-700">{{ req.full_name }}</p>
                   <p class="text-[10px] text-gray-400 font-black uppercase">{{ req.dept_name }}</p>
                </td>
                <td class="px-8 py-6">
                   <span [class]="req.role_name === 'Student' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'" 
                         class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-current opacity-70">
                      {{ req.role_name }}
                   </span>
                </td>
                <td class="px-8 py-6 text-gray-400 text-xs font-bold">{{ req.created_at | date:'medium' }}</td>
                <td class="px-8 py-6 text-right space-x-3">
                   <button (click)="onApprove(req.reg_id)" class="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all">APPROVE</button>
                   <button (click)="onReject(req.reg_id)" class="bg-rose-50 text-rose-600 px-5 py-2 rounded-xl text-xs font-black hover:bg-rose-600 hover:text-white transition-all">REJECT</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="requests().length === 0" class="p-24 text-center">
             <div class="text-6xl mb-6">🏜️</div>
             <p class="text-gray-400 font-black uppercase tracking-widest text-xs">No pending registration requests. The gateway is clear.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApprovalsComponent implements OnInit {
    authService = inject(AuthService);
    requests = signal<any[]>([]);

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.authService.getPendingRegistrations().subscribe(res => this.requests.set(res));
    }

    onApprove(id: number) {
        if (confirm('Verify and approve this academic credential?')) {
            this.authService.approveRegistration(id, 'Approved').subscribe(() => this.loadRequests());
        }
    }

    onReject(id: number) {
        if (confirm('Reject and dispose of this access request?')) {
            this.authService.approveRegistration(id, 'Rejected').subscribe(() => this.loadRequests());
        }
    }
}
