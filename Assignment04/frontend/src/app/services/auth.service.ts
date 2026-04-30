import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
    id: number;
    username: string;
    role: 'student' | 'teacher';
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(this.loadUser());

    constructor(private router: Router) { }

    private loadUser(): User | null {
        const data = localStorage.getItem('user');
        return data ? JSON.parse(data) : null;
    }

    login(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
        this.router.navigate(['/dashboard']);
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isTeacher() {
        return this.currentUser()?.role === 'teacher';
    }

    isStudent() {
        return this.currentUser()?.role === 'student';
    }
}
