import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userKey = 'currentUser';

    constructor(private router: Router) { }

    login(user: any): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.router.navigate(['/dashboard']);
    }

    logout(): void {
        localStorage.removeItem(this.userKey);
        this.router.navigate(['/login']);
    }

    getUser(): any {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getUser();
    }
}
