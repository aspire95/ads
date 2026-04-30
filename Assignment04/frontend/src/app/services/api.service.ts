import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://localhost:5000/api';

    constructor(private http: HttpClient) { }

    // Auth
    login(credentials: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/auth/login`, credentials);
    }

    register(user: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/auth/register`, user);
    }

    // Exams
    getExams(teacherId?: number): Observable<any[]> {
        let url = `${this.baseUrl}/exams`;
        if (teacherId) url += `?teacher_id=${teacherId}`;
        return this.http.get<any[]>(url);
    }

    createExam(exam: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/exams`, exam);
    }

    getExamById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/exams/${id}`);
    }

    // Questions
    getQuestionsByExam(examId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/questions/${examId}`);
    }

    addQuestion(question: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/questions`, question);
    }

    // Results
    submitResult(result: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/results`, result);
    }

    getUserResults(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/results/user/${userId}`);
    }

    getAllResults(teacherId?: number): Observable<any[]> {
        let url = `${this.baseUrl}/results`;
        if (teacherId) url += `?teacher_id=${teacherId}`;
        return this.http.get<any[]>(url);
    }

    // New API Methods
    updateExam(id: number, exam: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/exams/${id}`, exam);
    }

    deleteExam(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/exams/${id}`);
    }

    getStudents(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users/students`);
    }

    assignExam(examId: number, studentIds: number[]): Observable<any> {
        return this.http.post(`${this.baseUrl}/assignments`, { exam_id: examId, student_ids: studentIds });
    }

    getAssignedExams(studentId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/assignments/student/${studentId}`);
    }
}
