import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent {
    credentials = { username: '', password: '' };
    error = '';

    constructor(
        private api: ApiService,
        private auth: AuthService
    ) { }

    onSubmit() {
        this.api.login(this.credentials).subscribe({
            next: (user) => this.auth.login(user),
            error: (err) => this.error = 'Invalid username or password'
        });
    }
}
