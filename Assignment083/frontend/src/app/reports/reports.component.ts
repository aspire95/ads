import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-in fade-in zoom-in duration-500">
      <div class="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-end gap-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-10 opacity-5 text-9xl">📊</div>
        <div class="flex-grow z-10">
          <label class="block text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Strategic Analytics Engine</label>
          <div class="relative group">
            <select [(ngModel)]="currentTable" (change)="generateReport()" 
                    class="w-full bg-gray-50 border-2 border-gray-100 group-hover:border-blue-200 rounded-3xl px-8 py-5 text-xl font-black text-gray-800 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Choose Dataset Source...</option>
              <option *ngFor="let table of entities()" [value]="table">{{ table | uppercase }}</option>
            </select>
            <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-black tracking-widest">▼</div>
          </div>
        </div>
        <button (click)="exportReport()" [disabled]="!reportData().length"
                class="z-10 bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black flex items-center shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 disabled:opacity-20 transition-all active:scale-95 group">
          <svg class="w-6 h-6 mr-3 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Intelligence
        </button>
      </div>

      <!-- Report Visualization -->
      <div *ngIf="reportData().length" class="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div class="p-10 border-b flex justify-between items-center bg-gray-50/20">
          <div>
            <h3 class="text-3xl font-black text-gray-900 tracking-tighter">Analytical Review: {{ currentTable | uppercase }}</h3>
            <p class="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">Verified Academic Ledger</p>
          </div>
          <div class="text-right">
             <span class="bg-indigo-50 text-indigo-700 border border-indigo-100 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                {{ reportData().length }} Data Points
             </span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th *ngFor="let col of cols()" class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                  {{ col.replace('_', ' ') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let row of reportData(); let i = index" 
                  class="hover:bg-indigo-50/30 transition-all group">
                <td *ngFor="let col of cols()" class="px-10 py-6 text-sm font-bold text-gray-600 group-hover:text-indigo-700">
                  <span class="bg-white px-3 py-1 rounded-lg border border-transparent group-hover:border-indigo-100 transition-all shadow-none group-hover:shadow-sm">
                    {{ row[col] || '—' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="p-10 bg-indigo-50/30 border-t border-indigo-50 text-center">
           <p class="text-[10px] font-black text-indigo-300 uppercase tracking-widest">End of Intelligence Report — University Information System</p>
        </div>
      </div>

      <div *ngIf="currentTable && !reportData().length" class="p-32 text-center rounded-[3rem] bg-white border border-gray-100">
        <div class="inline-block p-10 rounded-full bg-gray-50 mb-8 border border-gray-100 rotate-12">
          <span class="text-6xl">🔍</span>
        </div>
        <h4 class="text-3xl font-black text-gray-900 tracking-tight">Access Restricted or Void</h4>
        <p class="text-gray-400 font-bold mt-2 max-w-md mx-auto">This specific dataset contains zero localized entries for your authorization level.</p>
      </div>
    </div>
  `
})
export class ReportComponent {
  dataService = inject(DataService);

  entities = signal<string[]>([]);
  reportData = signal<any[]>([]);
  cols = signal<string[]>([]);
  currentTable = '';

  constructor() {
    this.dataService.getEntities().subscribe(res => this.entities.set(res));
  }

  generateReport() {
    if (!this.currentTable) {
      this.reportData.set([]);
      this.cols.set([]);
      return;
    }
    this.dataService.getData(this.currentTable).subscribe(res => {
      this.reportData.set(res);
      if (res.length > 0) {
        this.cols.set(Object.keys(res[0]));
      } else {
        this.cols.set([]);
      }
    });
  }

  exportReport() {
    const data = this.reportData();
    if (!data.length) return;

    const headers = this.cols().join(',');
    const rows = data.map(row =>
      this.cols().map(col => {
        const val = row[col] === null ? '' : row[col];
        return JSON.stringify(val);
      }).join(',')
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `UIS_REPORT_${this.currentTable}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
