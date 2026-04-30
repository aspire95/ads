import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api';

    user = signal<{ username: string, role: string } | null>(null);
    isLoggedIn = computed(() => !!this.user());

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                this.user.set(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
    }

    login(credentials: any) {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap(res => {
                const userData = { username: res.username, role: res.role };
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(userData));
                this.user.set(userData);
            })
        );
    }

    registerRequest(data: any) {
        return this.http.post(`${this.apiUrl}/register/request`, data);
    }

    getPendingRegistrations() {
        return this.http.get<any[]>(`${this.apiUrl}/register/requests`);
    }

    approveRegistration(regId: number, status: 'Approved' | 'Rejected') {
        return this.http.post(`${this.apiUrl}/register/approve`, { regId, status });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user.set(null);
    }

    getToken() {
        return localStorage.getItem('token');
    }
}
