import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5000/api/students';
  private http = inject(HttpClient);
  
  // Refresh trigger for data updates
  refreshTrigger = signal(0);

  getStudents() {
    return this.http.get<Student[]>(this.apiUrl);
  }

  async addStudent(student: Student) {
    const res = await firstValueFrom(this.http.post<Student>(this.apiUrl, student));
    this.refreshTrigger.update(v => v + 1);
    return res;
  }

  async updateStudent(id: string, student: Student) {
    const res = await firstValueFrom(this.http.put<Student>(`${this.apiUrl}/${id}`, student));
    this.refreshTrigger.update(v => v + 1);
    return res;
  }

  async deleteStudent(id: string) {
    const res = await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    this.refreshTrigger.update(v => v + 1);
    return res;
  }
}
