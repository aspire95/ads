import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getDashboardStats() {
        return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
    }

    getTasks() {
        return this.http.get<any[]>(`${this.apiUrl}/tasks`);
    }

    createTask(task: any) {
        return this.http.post(`${this.apiUrl}/tasks`, task);
    }

    submitTask(submission: any) {
        return this.http.post(`${this.apiUrl}/tasks/submit`, submission);
    }

    getSubmissions(taskId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/tasks/${taskId}/submissions`);
    }

    gradeTask(gradeData: any) {
        return this.http.post(`${this.apiUrl}/tasks/grade`, gradeData);
    }

    getEntities() {
        return this.http.get<string[]>(`${this.apiUrl}/entities`);
    }

    getSchema(table: string) {
        return this.http.get<any[]>(`${this.apiUrl}/schema/${table}`);
    }

    getData(table: string) {
        return this.http.get<any[]>(`${this.apiUrl}/data/${table}`);
    }

    createData(table: string, data: any) {
        return this.http.post(`${this.apiUrl}/data/${table}`, data);
    }

    updateData(table: string, data: any, keys: any) {
        return this.http.put(`${this.apiUrl}/data/${table}`, { data, keys });
    }

    deleteData(table: string, keys: any) {
        return this.http.post(`${this.apiUrl}/data/${table}/delete`, keys);
    }
}
