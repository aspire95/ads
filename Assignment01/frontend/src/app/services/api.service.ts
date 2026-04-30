import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:3000'; // Base URL (removed /api since server uses root /stud1)

    constructor(private http: HttpClient) { }

    getStud1(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/stud1`);
    }

    addStud1(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/stud1`, data);
    }

    updateStud1(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/stud1/${id}`, data);
    }

    deleteStud1(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/stud1/${id}`);
    }
}
