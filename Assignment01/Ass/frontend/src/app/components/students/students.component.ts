import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-students',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './students.component.html',
    styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
    students: any[] = [];
    departments: any[] = [];

    studentModel: any = {
        first_name: '',
        last_name: '',
        email: '',
        department_id: null,
        dob: ''
    };

    isEditing = false;
    showForm = false;

    constructor(private api: ApiService) { }

    ngOnInit(): void {
        this.loadStudents();
        this.loadDepartments();
    }

    loadStudents() {
        this.api.get('students').subscribe(data => this.students = data);
    }

    loadDepartments() {
        this.api.get('departments').subscribe(data => this.departments = data);
    }

    openForm(student: any = null) {
        this.showForm = true;
        if (student) {
            this.isEditing = true;
            // formatting date for input type=date (YYYY-MM-DD)
            const dob = student.dob ? new Date(student.dob).toISOString().split('T')[0] : '';
            this.studentModel = { ...student, dob };
        } else {
            this.isEditing = false;
            this.resetForm();
        }
    }

    closeForm() {
        this.showForm = false;
        this.resetForm();
    }

    resetForm() {
        this.studentModel = {
            first_name: '',
            last_name: '',
            email: '',
            department_id: null,
            dob: ''
        };
    }

    save() {
        if (this.isEditing) {
            this.api.put(`students/${this.studentModel.id}`, this.studentModel).subscribe(() => {
                this.loadStudents();
                this.closeForm();
            });
        } else {
            this.api.post('students', this.studentModel).subscribe(() => {
                this.loadStudents();
                this.closeForm();
            });
        }
    }

    delete(id: number) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.api.delete(`students/${id}`).subscribe(() => {
                this.loadStudents();
            });
        }
    }
}
