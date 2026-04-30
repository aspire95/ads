import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styles: []
})
export class RegisterComponent {
    user = { username: '', password: '', role: 'student' };
    error = '';

    constructor(
        private api: ApiService,
        private router: Router
    ) { }

    onSubmit() {
        this.api.register(this.user).subscribe({
            next: () => this.router.navigate(['/login']),
            error: (err) => this.error = 'Registration failed. Try a different username.'
        });
    }
}
