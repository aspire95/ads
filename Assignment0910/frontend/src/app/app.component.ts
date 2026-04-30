import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from './services/student.service';
import { Student } from './models/student.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  studentService = inject(StudentService);
  
  students: Student[] = [];
  currentStudent: Student = { prn: '', name: '', course: '', email: '' };
  isEditing = false;
  isLoading = false;

  constructor() {
    // Re-fetch when refresh trigger pulses
    effect(() => {
      this.studentService.refreshTrigger();
      this.fetchStudents();
    });
  }

  async fetchStudents() {
    this.isLoading = true;
    this.studentService.getStudents().subscribe({
      next: (res) => {
        this.students = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Fetch Error:', err);
        this.isLoading = false;
      }
    });
  }

  async handleSubmit() {
    if (!this.currentStudent.prn || !this.currentStudent.name) return;

    this.isLoading = true;
    try {
      if (this.isEditing && this.currentStudent.id) {
        await this.studentService.updateStudent(this.currentStudent.id, this.currentStudent);
      } else {
        await this.studentService.addStudent(this.currentStudent);
      }
      this.resetForm();
    } catch (err) {
      console.error('Submit Error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  editStudent(student: Student) {
    this.currentStudent = { ...student };
    this.isEditing = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteStudent(id?: string) {
    if (!id || !confirm('Are you sure you want to delete this record?')) return;
    this.isLoading = true;
    try {
      await this.studentService.deleteStudent(id);
    } catch (err) {
      console.error('Delete Error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  resetForm() {
    this.currentStudent = { prn: '', name: '', course: '', email: '' };
    this.isEditing = false;
  }
}
