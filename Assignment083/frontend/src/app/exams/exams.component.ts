import { Component } from '@angular/core';

@Component({
    selector: 'app-exams',
    standalone: true,
    template: `
    <div class="animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto mt-10">
      <div class="bg-gradient-to-tr from-indigo-900 via-slate-800 to-black rounded-[3rem] shadow-2xl overflow-hidden relative p-12 text-white border border-white/10">
         <div class="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div class="flex items-center gap-6 mb-12">
            <div class="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-4xl shadow-inner">🎟️</div>
            <div>
               <h2 class="text-4xl font-black tracking-tight mb-2">Exam Hall Tickets</h2>
               <p class="text-indigo-200 font-medium">Download and print your official examination admit cards.</p>
            </div>
         </div>

         <div class="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
            <h3 class="text-xl font-bold mb-6 text-white tracking-widest uppercase text-center">Available Downloads</h3>
            
            <div class="bg-indigo-900/50 rounded-2xl p-6 border border-indigo-500/30 flex items-center justify-between group hover:bg-indigo-800/50 transition-colors cursor-pointer">
               <div class="flex items-center gap-6">
                  <div class="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📄</div>
                  <div>
                     <p class="font-black text-xl mb-1 text-white">End Semester Theory Exams - Fall '26</p>
                     <p class="text-xs font-bold text-indigo-300 uppercase tracking-widest">Released: Nov 05, 2026</p>
                  </div>
               </div>
               <button class="bg-white text-indigo-900 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 hover:-translate-y-1 transform">
                 Download PDF
               </button>
            </div>
         </div>
      </div>
    </div>
  `
})
export class ExamsComponent { }
