import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-student-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './student-form.component.html',
    styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
    students: any[] = [];
    formData: { id?: number; name: string; prn: string } = { name: '', prn: '' };
    isLoading = false;
    isEditing = false;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadStudents();
    }

    loadStudents(): void {
        this.isLoading = true;
        this.apiService.getStud1().subscribe({
            next: (data) => {
                this.students = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load students', err);
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (!this.formData.name || !this.formData.prn) return;

        this.isLoading = true;
        if (this.isEditing && this.formData.id) {
            this.apiService.updateStud1(this.formData.id, this.formData).subscribe({
                next: () => {
                    this.loadStudents();
                    this.resetForm();
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Failed to update student', err);
                    this.isLoading = false;
                }
            });
        } else {
            this.apiService.addStud1(this.formData).subscribe({
                next: () => {
                    this.loadStudents();
                    this.resetForm();
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Failed to create student', err);
                    this.isLoading = false;
                }
            });
        }
    }

    editStudent(student: any): void {
        this.isEditing = true;
        this.formData = { ...student };
    }

    cancelEdit(): void {
        this.resetForm();
    }

    deleteStudent(id: number): void {
        if (confirm('Are you sure you want to delete this student?')) {
            this.isLoading = true;
            this.apiService.deleteStud1(id).subscribe({
                next: () => {
                    this.loadStudents();
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Failed to delete student', err);
                    this.isLoading = false;
                }
            });
        }
    }

    private resetForm(): void {
        this.formData = { name: '', prn: '' };
        this.isEditing = false;
    }
}
