import { Component } from '@angular/core';

@Component({
    selector: 'app-library',
    standalone: true,
    template: `
    <div class="animate-in slide-in-from-top-4 duration-500 max-w-5xl mx-auto">
      <div class="bg-slate-900 text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden mb-12">
        <div class="absolute right-0 top-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]"></div>
        <div class="relative z-10">
           <h2 class="text-5xl font-black tracking-tight mb-4">Central Library</h2>
           <p class="text-blue-100/70 font-medium text-lg max-w-lg mb-8">Access millions of digital assets, research papers, and textbook references anywhere.</p>
           
           <div class="relative max-w-2xl bg-white/10 rounded-2xl p-2 border border-white/20 backdrop-blur-md flex items-center">
             <input type="text" placeholder="Search by title, author, or ISBN..." 
                    class="w-full bg-transparent text-white placeholder:text-gray-400 font-medium px-4 py-2 outline-none">
             <button class="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-colors">Search</button>
           </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-center">
           <div class="w-16 h-16 bg-gray-50 mx-auto rounded-full flex items-center justify-center text-2xl mb-4">📖</div>
           <h4 class="font-black text-gray-900 mb-2">Issued Books</h4>
           <div class="text-4xl font-black text-blue-600 mb-2">3</div>
           <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Returns pending</p>
        </div>
        <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-center">
           <div class="w-16 h-16 bg-gray-50 mx-auto rounded-full flex items-center justify-center text-2xl mb-4">⏳</div>
           <h4 class="font-black text-gray-900 mb-2">Overdue Fine</h4>
           <div class="text-4xl font-black text-rose-500 mb-2">$0.00</div>
           <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Clear Records</p>
        </div>
        <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-center">
           <div class="w-16 h-16 bg-gray-50 mx-auto rounded-full flex items-center justify-center text-2xl mb-4">🔖</div>
           <h4 class="font-black text-gray-900 mb-2">Digital Vault</h4>
           <div class="text-4xl font-black text-emerald-600 mb-2">45</div>
           <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Saved Articles</p>
        </div>
      </div>
    </div>
  `
})
export class LibraryComponent { }
