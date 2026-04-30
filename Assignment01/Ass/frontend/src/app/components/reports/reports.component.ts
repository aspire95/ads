import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent {
    tables = ['students03', 'departments03', 'users03'];
    selectedTable = 'students03';
    reportData: any[] = [];
    headers: string[] = [];
    loading = false;

    constructor(private api: ApiService) { }

    generateReport() {
        this.loading = true;
        this.api.get(`report?table=${this.selectedTable}`).subscribe(data => {
            this.reportData = data;
            if (data.length > 0) {
                this.headers = Object.keys(data[0]);
            } else {
                this.headers = [];
            }
            this.loading = false;
        }, error => {
            console.error(error);
            this.loading = false;
        });
    }
}
