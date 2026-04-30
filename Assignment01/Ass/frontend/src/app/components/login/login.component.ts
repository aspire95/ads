import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    username = '';
    password = '';
    errorMsg = '';
    loading = false;

    constructor(private api: ApiService, private auth: AuthService) { }

    onSubmit() {
        if (!this.username || !this.password) {
            this.errorMsg = 'Please enter both username and password';
            return;
        }

        this.loading = true;
        this.errorMsg = '';

        this.api.post('login', { username: this.username, password: this.password })
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.auth.login(res.user);
                    } else {
                        this.errorMsg = res.message || 'Login failed';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.errorMsg = err.error?.message || 'Login failed. Please try again.';
                    this.loading = false;
                }
            });
    }
}
