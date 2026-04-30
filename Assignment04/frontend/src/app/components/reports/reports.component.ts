import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './reports.component.html',
    styles: []
})
export class ReportsComponent implements OnInit {
    results: any[] = [];
    filterText: string = '';

    constructor(private api: ApiService, private auth: AuthService) { }

    ngOnInit() {
        const currentUser = this.auth.currentUser();
        this.api.getAllResults(currentUser?.id).subscribe(data => {
            this.results = data;
        });
    }

    get filteredResults() {
        return this.results.filter(r =>
            r.username.toLowerCase().includes(this.filterText.toLowerCase()) ||
            r.exam_title.toLowerCase().includes(this.filterText.toLowerCase())
        );
    }

    exportData() {
        alert('Exporting to CSV... (Simulated)');
    }
}
