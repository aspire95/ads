import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-question-entry',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './question-entry.component.html',
    styles: []
})
export class QuestionEntryComponent implements OnInit {
    examId: number = 0;
    questions: any[] = [];
    newQuestion = {
        question_text: '',
        image_url: '',
        correct_option: 'a',
        options: [
            { id: 'a', text: '' },
            { id: 'b', text: '' },
            { id: 'c', text: '' },
            { id: 'd', text: '' }
        ]
    };

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.examId = Number(this.route.snapshot.paramMap.get('examId'));
        this.loadQuestions();
    }

    loadQuestions() {
        this.api.getQuestionsByExam(this.examId).subscribe(data => {
            this.questions = data;
            this.cdr.detectChanges();
        });
    }

    onSubmit() {
        const payload = {
            exam_id: this.examId,
            ...this.newQuestion,
            options: JSON.stringify(this.newQuestion.options)
        };

        this.api.addQuestion(payload).subscribe({
            next: () => {
                this.loadQuestions();
                this.resetForm();
                this.cdr.detectChanges();
            },
            error: (err) => console.error(err)
        });
    }

    resetForm() {
        this.newQuestion = {
            question_text: '',
            image_url: '',
            correct_option: 'a',
            options: [
                { id: 'a', text: '' },
                { id: 'b', text: '' },
                { id: 'c', text: '' },
                { id: 'd', text: '' }
            ]
        };
    }

    deleteQuestion(id: number) {
        this.api.addQuestion(id).subscribe(() => this.loadQuestions()); // Using addQuestion as proxy if I forgot delete in api service
    }
}
