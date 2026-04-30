import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 leading-tight">Academic Explorer</h2>
          <p class="text-gray-400 text-sm font-medium">Explore and manage authorized datasets for your role.</p>
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Active Table:</span>
          <select (change)="onTableChange($event)" 
            class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none block w-full md:w-64 p-3 transition-all">
            <option value="">Select an Entity...</option>
            <option *ngFor="let table of entities()" [value]="table">{{ table | uppercase }}</option>
          </select>
        </div>
      </div>

      <div *ngIf="selectedTable()" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Toolbar -->
        <div class="p-6 border-b flex flex-col md:flex-row justify-between items-center bg-gray-50/30 gap-4">
          <div class="flex items-center gap-2">
             <div class="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
             <h3 class="font-bold text-gray-700 uppercase tracking-widest text-xs">{{ selectedTable() }} Records</h3>
          </div>
          
          <button *ngIf="auth.user()?.role === 'Admin'" (click)="openAddModal()" 
            class="w-full md:w-auto bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center active:scale-95">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Add New Record
          </button>
          
          <div *ngIf="auth.user()?.role !== 'Admin'" class="text-xs font-bold text-orange-500 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
             ⚠️ View Only Access
          </div>
        </div>

        <!-- Dynamic Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-[10px] text-gray-400 uppercase bg-white border-b tracking-widest">
              <tr>
                <th *ngFor="let col of schema()" class="px-8 py-4 font-black">{{ col.column_name }}</th>
                <th *ngIf="auth.user()?.role !== 'Student'" class="px-8 py-4 text-right">Registry Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let row of tableData()" class="group hover:bg-blue-50/30 transition-colors">
                <td *ngFor="let col of schema()" class="px-8 py-4">
                  <span class="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{{ row[col.column_name] }}</span>
                </td>
                <td *ngIf="auth.user()?.role !== 'Student'" class="px-8 py-4 text-right space-x-3">
                  <button (click)="openEditModal(row)" class="text-blue-600 hover:text-blue-900 font-bold transition-transform hover:scale-110">Edit</button>
                  <button *ngIf="auth.user()?.role === 'Admin'" (click)="onDelete(row)" class="text-rose-600 hover:text-rose-900 font-bold transition-transform hover:scale-110">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="tableData().length === 0" class="p-20 text-center flex flex-col items-center">
             <div class="text-4xl mb-4 text-gray-200">📂</div>
             <p class="text-gray-400 font-bold">No Records Found</p>
             <p class="text-gray-300 text-xs mt-1">Try selecting a different table or check your permissions.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Redesigned Modal -->
    <div *ngIf="showModal()" class="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
        <div class="p-10 border-b bg-gradient-to-br from-blue-600 to-blue-800 text-white relative">
          <div class="absolute top-0 right-0 p-10 opacity-10 text-9xl">🏛️</div>
          <h3 class="text-2xl font-black">{{ isEdit() ? 'Update Registry' : 'New Admission' }}</h3>
          <p class="text-blue-100 text-sm opacity-80 mt-1">Modifying: {{ selectedTable() | uppercase }}</p>
        </div>
        
        <form (submit)="onSave()" class="p-10 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div *ngFor="let col of schema()" class="group">
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-600 transition-colors">
              {{ col.column_name.replace('_', ' ') }}
            </label>
            <input [type]="getInputType(col.data_type)" 
                   [(ngModel)]="formModel[col.column_name]" 
                   [name]="col.column_name"
                   [disabled]="isEdit() && isPrimaryKey(col.column_name)"
                   class="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-gray-300 font-medium"
                   [placeholder]="'Enter ' + col.column_name">
          </div>
        </form>
        
        <div class="p-10 bg-gray-50 flex justify-end gap-3">
          <button (click)="showModal.set(false)" class="px-8 py-3 text-gray-500 font-bold hover:text-gray-800 transition-colors">Dismiss</button>
          <button (click)="onSave()" class="px-10 py-3 bg-primary text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-800 active:scale-95 transition-all">
            {{ isEdit() ? 'Update Record' : 'Commit to Database' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class EntityListComponent {
  dataService = inject(DataService);
  auth = inject(AuthService);

  entities = signal<string[]>([]);
  selectedTable = signal<string>('');
  schema = signal<any[]>([]);
  tableData = signal<any[]>([]);

  showModal = signal(false);
  isEdit = signal(false);
  formModel: any = {};
  originalRow: any = null;

  constructor() {
    this.dataService.getEntities().subscribe(res => this.entities.set(res));
  }

  onTableChange(e: any) {
    const table = e.target.value;
    this.selectedTable.set(table);
    if (table) {
      this.loadTableInfo(table);
    }
  }

  loadTableInfo(table: string) {
    this.dataService.getSchema(table).subscribe(res => this.schema.set(res));
    this.dataService.getData(table).subscribe(res => this.tableData.set(res));
  }

  getInputType(dbType: string) {
    if (dbType.includes('numeric') || dbType.includes('int')) return 'number';
    return 'text';
  }

  isPrimaryKey(col: string) {
    const pk = col.toLowerCase();
    return pk === 'id' || pk === 'course_id' || pk === 'dept_name' || pk === 'user_id' || pk === 'role_id';
  }

  openAddModal() {
    this.isEdit.set(false);
    this.formModel = {};
    this.schema().forEach(col => this.formModel[col.column_name] = '');
    this.showModal.set(true);
  }

  openEditModal(row: any) {
    this.isEdit.set(true);
    this.formModel = { ...row };
    this.originalRow = row;
    this.showModal.set(true);
  }

  onSave() {
    if (this.isEdit()) {
      const pkObj: any = {};
      this.schema().filter(c => this.isPrimaryKey(c.column_name)).forEach(c => {
        pkObj[c.column_name] = this.originalRow[c.column_name];
      });
      this.dataService.updateData(this.selectedTable(), this.formModel, pkObj).subscribe(() => {
        this.showModal.set(false);
        this.loadTableInfo(this.selectedTable());
      });
    } else {
      this.dataService.createData(this.selectedTable(), this.formModel).subscribe(() => {
        this.showModal.set(false);
        this.loadTableInfo(this.selectedTable());
      });
    }
  }

  onDelete(row: any) {
    if (confirm('Are you sure you want to permanently delete this academic record? This action cannot be undone.')) {
      const pkObj: any = {};
      this.schema().filter(c => this.isPrimaryKey(c.column_name)).forEach(c => {
        pkObj[c.column_name] = row[c.column_name];
      });
      this.dataService.deleteData(this.selectedTable(), pkObj).subscribe(() => {
        this.loadTableInfo(this.selectedTable());
      });
    }
  }
}
