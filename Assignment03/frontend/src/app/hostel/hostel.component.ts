import { Component } from '@angular/core';

@Component({
    selector: 'app-hostel',
    standalone: true,
    template: `
    <div class="animate-in fade-in duration-500">
      <div class="mb-10 text-center max-w-2xl mx-auto">
        <h2 class="text-4xl font-black text-gray-900 tracking-tight">Hostel & Accommodation</h2>
        <p class="text-gray-500 mt-4 font-medium leading-relaxed">Submit your hostel application, request room changes, or report maintenance queries effectively.</p>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
         <div class="group bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-[2.5rem] p-10 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
            <div class="w-16 h-16 bg-orange-200 text-orange-600 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:-translate-y-2 transition-transform">🏢</div>
            <h3 class="text-2xl font-black text-gray-900 mb-2">My Accommodation</h3>
            <p class="text-gray-600 mb-6 text-sm font-medium">Room 402, Block A - North Campus</p>
            <button class="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl">View Details</button>
         </div>

         <div class="group bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-[2.5rem] p-10 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
            <div class="w-16 h-16 bg-blue-200 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:-translate-y-2 transition-transform">🔧</div>
            <h3 class="text-2xl font-black text-gray-900 mb-2">Maintenance Request</h3>
            <p class="text-gray-600 mb-6 text-sm font-medium">Report an issue with room facilities or infrastructure.</p>
            <button class="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl">Lodge Complaint</button>
         </div>
      </div>
    </div>
  `
})
export class HostelComponent { }
