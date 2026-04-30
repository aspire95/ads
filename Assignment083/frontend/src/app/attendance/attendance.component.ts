import { Component } from '@angular/core';

@Component({
    selector: 'app-attendance',
    standalone: true,
    template: `
    <div class="animate-in slide-in-from-bottom-4 duration-500">
      <div class="mb-8">
        <h2 class="text-3xl font-black text-gray-900 tracking-tight">Attendance Records</h2>
        <p class="text-gray-500 mt-2 font-medium">Track and manage student presence across all enrolled courses.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 shadow-sm">
          <div class="w-12 h-12 bg-indigo-200 text-indigo-700 rounded-2xl flex items-center justify-center text-xl mb-4">📅</div>
          <p class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Overall</p>
          <h3 class="text-3xl font-black text-indigo-950">85%</h3>
        </div>
        
        <div class="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 shadow-sm">
          <div class="w-12 h-12 bg-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center text-xl mb-4">✔️</div>
          <p class="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Present Days</p>
          <h3 class="text-3xl font-black text-emerald-950">102</h3>
        </div>

        <div class="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 shadow-sm">
          <div class="w-12 h-12 bg-rose-200 text-rose-700 rounded-2xl flex items-center justify-center text-xl mb-4">❌</div>
          <p class="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-1">Absent Days</p>
          <h3 class="text-3xl font-black text-rose-950">18</h3>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl">
         <h4 class="text-lg font-black text-gray-800 mb-6">Course-wise Attendance</h4>
         <div class="flex items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p class="text-gray-400 font-bold uppercase text-xs tracking-widest gap-2 flex items-center">
              <span>🚧</span> Attendance Data synchronization in progress...
            </p>
         </div>
      </div>
    </div>
  `
})
export class AttendanceComponent { }
