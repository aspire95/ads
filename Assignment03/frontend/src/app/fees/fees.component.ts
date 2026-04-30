import { Component } from '@angular/core';

@Component({
    selector: 'app-fees',
    standalone: true,
    template: `
    <div class="animate-in fade-in duration-500">
      <div class="mb-8 flex justify-between items-end">
        <div>
           <h2 class="text-3xl font-black text-gray-900 tracking-tight">Fee Management</h2>
           <p class="text-gray-500 mt-2 font-medium">View your financial history and pay pending dues.</p>
        </div>
        <button class="bg-slate-900 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">Pay Dues Now</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <p class="text-xs font-bold text-blue-200 uppercase tracking-[0.2em] mb-2">Total Outstanding</p>
          <h3 class="text-5xl font-black mb-6">$1,250.00</h3>
          <p class="text-sm font-medium text-blue-100 opacity-80">Next due date: November 15, 2026</p>
        </div>
        
        <div class="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-xl flex flex-col justify-center">
          <h4 class="text-lg font-black text-gray-800 mb-6">Recent Transactions</h4>
          <div class="space-y-4">
             <div class="flex items-center justify-between border-b border-gray-50 pb-4">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">💸</div>
                   <div>
                     <p class="font-bold text-sm text-gray-800">Tuition Fee - Fall Sem</p>
                     <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sep 01, 2026</p>
                   </div>
                </div>
                <p class="font-bold text-gray-900">$2,500.00</p>
             </div>
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">💸</div>
                   <div>
                     <p class="font-bold text-sm text-gray-800">Library Due</p>
                     <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Aug 15, 2026</p>
                   </div>
                </div>
                <p class="font-bold text-gray-900">$50.00</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeesComponent { }
