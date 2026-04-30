import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './dashboard.component.html',
    styles: []
})
export class DashboardComponent implements OnInit {
    exams: any[] = [];
    results: any[] = [];
    completedExamIds: Set<number> = new Set();
    stats = { totalExams: 0, totalStudents: 0, avgScore: 0 };

    isDarkMode = false;

    showCreateModal = false;
    newExam = {
        title: '',
        description: '',
        subject: '',
        duration_minutes: 60,
        created_by: 0
    };

    // Edit Exam
    showEditModal = false;
    editingExam: any = null;

    // Assign operations
    students: any[] = [];
    showAssignModal = false;
    assigningExam: any = null;
    selectedStudents: { [id: number]: boolean } = {};
    selectAllStudents = false;
    studentSearch = '';

    constructor(
        public auth: AuthService,
        private api: ApiService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // Initialize dark mode based on current class
        this.isDarkMode = document.documentElement.classList.contains('dark');
        this.loadData();
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    loadData() {
        const currentUser = this.auth.currentUser();

        if (this.auth.isTeacher()) {
            this.api.getExams(currentUser?.id).subscribe(data => {
                this.exams = data;
                this.stats.totalExams = data.length;
                this.cdr.detectChanges();
            });

            this.api.getAllResults(currentUser?.id).subscribe(data => {
                this.results = data;
                this.stats.totalStudents = new Set(data.map(r => r.user_id)).size;
                this.calculateAvg(data);
                this.cdr.detectChanges();
            });

            this.api.getStudents().subscribe(data => {
                this.students = data;
                this.cdr.detectChanges();
            });
        } else if (currentUser) {
            this.api.getAssignedExams(currentUser.id).subscribe(data => {
                this.exams = data;
                this.stats.totalExams = data.length;
                this.cdr.detectChanges();
            });

            this.api.getUserResults(currentUser.id).subscribe(data => {
                this.results = data;
                this.completedExamIds = new Set(data.map((r: any) => r.exam_id));
                this.cdr.detectChanges();
            });
        }
    }

    createExam() {
        this.newExam.created_by = this.auth.currentUser()?.id || 0;
        this.api.createExam(this.newExam).subscribe({
            next: (res) => {
                // refreshing list
                this.loadData();
                this.showCreateModal = false;
                // reset form
                this.newExam = {
                    title: '',
                    description: '',
                    subject: '',
                    duration_minutes: 60,
                    created_by: this.auth.currentUser()?.id || 0
                };
            },
            error: (err) => {
                console.error("Error creating exam", err);
                alert("Failed to create exam");
            }
        });
    }

    calculateAvg(data: any[]) {
        if (data.length === 0) return;
        const sum = data.reduce((acc, curr) => acc + (curr.score / curr.total_questions * 100), 0);
        this.stats.avgScore = Math.round(sum / data.length);
    }

    // --- Edit and Delete ---
    openEditModal(exam: any) {
        this.editingExam = { ...exam };
        this.showEditModal = true;
    }

    updateExam() {
        if (!this.editingExam) return;
        this.api.updateExam(this.editingExam.id, this.editingExam).subscribe({
            next: () => {
                this.showEditModal = false;
                this.loadData();
                this.cdr.detectChanges();
            },
            error: (err) => alert("Failed to update exam")
        });
    }

    deleteExam(id: number) {
        if (confirm('Are you sure you want to delete this exam?')) {
            this.api.deleteExam(id).subscribe({
                next: () => {
                    this.loadData();
                    this.cdr.detectChanges();
                },
                error: (err) => alert("Failed to delete exam")
            });
        }
    }

    // --- Assignment ---
    openAssignModal(exam: any) {
        this.assigningExam = exam;
        this.selectedStudents = {};
        this.selectAllStudents = false;
        this.studentSearch = '';
        this.showAssignModal = true;
    }

    get filteredStudents() {
        return this.students.filter(s => s.username.toLowerCase().includes(this.studentSearch.toLowerCase()));
    }

    toggleSelectAll() {
        const filtered = this.filteredStudents;
        filtered.forEach(s => {
            this.selectedStudents[s.id] = this.selectAllStudents;
        });
    }

    get selectedCount() {
        return Object.values(this.selectedStudents).filter(v => v).length;
    }

    assignExamSubmit() {
        const ids = Object.keys(this.selectedStudents)
            .filter(id => this.selectedStudents[id as any])
            .map(id => Number(id));

        if (ids.length === 0) {
            alert('Please select at least one student');
            return;
        }

        this.api.assignExam(this.assigningExam.id, ids).subscribe({
            next: () => {
                alert('Exam assigned successfully!');
                this.showAssignModal = false;
                this.cdr.detectChanges();
            },
            error: (err) => alert("Failed to assign exam")
        });
    }

    logout() {
        this.auth.logout();
    }

    isExamCompleted(examId: number): boolean {
        return this.completedExamIds.has(examId);
    }
}
