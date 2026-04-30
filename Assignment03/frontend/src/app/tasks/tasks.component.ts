import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <header class="bg-indigo-700 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-10 opacity-10 text-9xl">📝</div>
        <div class="relative z-10">
           <h2 class="text-3xl font-black tracking-tight mb-2">Assignment Desk</h2>
           <p class="text-indigo-100 font-bold text-sm uppercase tracking-[0.2em]">{{ auth.user()?.role }} Module</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Task List -->
        <div class="lg:col-span-2 space-y-6">
          <div *ngIf="auth.user()?.role === 'Faculty'" class="bg-white p-6 rounded-2xl border border-dashed border-gray-200 flex justify-between items-center">
            <div>
              <h4 class="font-bold text-gray-800">Assign New Task</h4>
              <p class="text-xs text-gray-400">Collaborate with your course students</p>
            </div>
            <button (click)="showCreateModal.set(true)" class="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">Assign Task</button>
          </div>

          <div *ngFor="let task of tasks()" class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
             <div class="flex justify-between items-start mb-4">
               <div>
                 <span class="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg mb-2 inline-block">
                   {{ task.course_title }}
                 </span>
                 <h3 class="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{{ task.title }}</h3>
               </div>
               <div class="text-right">
                 <p class="text-[10px] font-black text-gray-400 uppercase">Due Date</p>
                 <p class="text-xs font-bold text-rose-500">{{ task.due_date | date:'mediumDate' }}</p>
               </div>
             </div>
             <p class="text-sm text-gray-600 leading-relaxed mb-6">{{ task.description }}</p>
             
             <div class="flex justify-between items-center pt-6 border-t border-gray-50">
               <div class="flex items-center gap-4">
                 <div class="flex items-center gap-2">
                   <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">👨‍🏫</div>
                   <p class="text-xs font-bold text-gray-400">{{ task.instructor_name }}</p>
                 </div>
                 <div *ngIf="task.grade" class="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                    <span class="text-[10px] font-black uppercase">Grade: {{ task.grade }}</span>
                 </div>
               </div>
               
               <div class="flex gap-2">
                 <button *ngIf="task.feedback" (click)="showFeedback(task)" class="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all">View Feedback</button>
                 <button *ngIf="auth.user()?.role === 'Student'" (click)="openSubmitModal(task)" class="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black active:scale-95 transition-all">
                   {{ hasSubmitted(task.task_id) ? 'Update Work' : 'Submit Work' }}
                 </button>
                 <button *ngIf="auth.user()?.role === 'Faculty'" (click)="viewSubmissions(task)" class="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                   Review Submissions
                 </button>
               </div>
          </div>

          <div *ngIf="tasks().length === 0" class="p-20 text-center bg-white rounded-[2.5rem] border border-gray-100">
             <span class="text-6xl">🏜️</span>
             <p class="text-gray-400 font-black mt-4 uppercase text-xs tracking-widest">No active assignments</p>
          </div>
        </div>

        <!-- Right Side Stats -->
        <div class="space-y-6">
           <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h4 class="font-black text-gray-900 text-sm uppercase tracking-widest mb-6 border-b pb-4">Performance Insights</h4>
             <div class="space-y-4">
                <div class="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                   <p class="text-[10px] font-black text-emerald-600 uppercase">Completion Rate</p>
                   <p class="text-xl font-black text-emerald-700">84%</p>
                </div>
                <div class="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                   <p class="text-[10px] font-black text-indigo-600 uppercase">Avg Grade</p>
                   <p class="text-xl font-black text-indigo-700">A-</p>
                </div>
             </div>
           </div>
        </div>
      </div>

      <!-- Create Task Modal -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl animate-in zoom-in duration-300">
          <div class="p-10 border-b bg-indigo-600 text-white rounded-t-[2.5rem]">
            <h3 class="text-2xl font-black">Assign New Task</h3>
            <p class="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">Course Distribution Module</p>
          </div>
          <form (submit)="onCreateTask()" class="p-10 space-y-6">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Task Title</label>
              <input [(ngModel)]="newTask.title" name="title" required class="w-full px-6 py-3 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold">
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea [(ngModel)]="newTask.description" name="description" rows="4" class="w-full px-6 py-3 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Course ID</label>
                <input [(ngModel)]="newTask.courseId" name="courseId" placeholder="e.g. CS101" required class="w-full px-6 py-3 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold uppercase">
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Due Date</label>
                <input type="date" [(ngModel)]="newTask.dueDate" name="dueDate" required class="w-full px-6 py-3 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold">
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-6">
               <button type="button" (click)="showCreateModal.set(false)" class="px-8 py-3 text-gray-500 font-bold uppercase text-[10px]">Cancel</button>
               <button type="submit" class="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">Broadcast Task</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Submit Modal -->
      <div *ngIf="showSubmitModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
         <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl animate-in zoom-in duration-300">
            <div class="p-10 border-b bg-gray-900 text-white rounded-t-[2.5rem]">
               <h3 class="text-2xl font-black">Submit Assignment</h3>
               <p class="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest">{{ selectedTask?.title }}</p>
            </div>
            <div class="p-10 space-y-6">
               <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Your Solution / Comments</label>
                  <textarea [(ngModel)]="submissionContent" rows="8" placeholder="Paste your work here..." class="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"></textarea>
               </div>
               <div class="flex justify-end gap-3 pt-4">
                  <button (click)="showSubmitModal.set(false)" class="px-8 py-3 text-gray-500 font-bold uppercase text-[10px]">Back</button>
                  <button (click)="onSubmitWork()" class="bg-gray-900 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">Finalize Submission</button>
               </div>
            </div>
         </div>
      </div>

    </div>
  `
})
export class TasksComponent implements OnInit {
    dataService = inject(DataService);
    auth = inject(AuthService);

    tasks = signal<any[]>([]);
    showCreateModal = signal(false);
    showSubmitModal = signal(false);

    newTask = { title: '', description: '', courseId: '', dueDate: '' };
    selectedTask: any = null;
    submissionContent = '';

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        this.dataService.getTasks().subscribe(res => this.tasks.set(res));
    }

    hasSubmitted(taskId: number) {
        return false; // In a full implementation, we'd check against a submission list
    }

    onCreateTask() {
        this.dataService.createTask(this.newTask).subscribe(() => {
            this.showCreateModal.set(false);
            this.loadTasks();
        });
    }

    openSubmitModal(task: any) {
        this.selectedTask = task;
        this.showSubmitModal.set(true);
    }

    onSubmitWork() {
        this.dataService.submitTask({ taskId: this.selectedTask.task_id, content: this.submissionContent }).subscribe(() => {
            this.showSubmitModal.set(false);
            alert('Work submitted successfully!');
        });
    }

    showFeedback(task: any) {
        alert(`Instructor Feedback: ${task.feedback}`);
    }

    viewSubmissions(task: any) {
        alert('Submission viewer coming in next phase!');
    }
}
