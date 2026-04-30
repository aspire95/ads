import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-exam-taker',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './exam-taker.component.html',
    styles: []
})
export class ExamTakerComponent implements OnInit, OnDestroy {
    exam: any = null;
    questions: any[] = [];
    currentIndex: number = 0;
    answers: { [key: number]: string } = {};
    timer: any;
    timeLeft: number = 0;
    completed: boolean = false;
    score: number = 0;
    isDarkMode = false;

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private auth: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.isDarkMode = document.documentElement.classList.contains('dark');

        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.api.getExamById(id).subscribe(exam => {
            this.exam = exam;
            this.timeLeft = exam.duration_minutes * 60;
            this.startTimer();
            this.cdr.detectChanges();
        });

        this.api.getQuestionsByExam(id).subscribe(data => {
            this.questions = data;
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy() {
        if (this.timer) clearInterval(this.timer);
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.cdr.detectChanges();
            } else {
                this.finishExam();
            }
        }, 1000);
    }

    get formattedTime() {
        const min = Math.floor(this.timeLeft / 60);
        const sec = this.timeLeft % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    prev() { if (this.currentIndex > 0) this.currentIndex--; }
    next() { if (this.currentIndex < this.questions.length - 1) this.currentIndex++; }

    finishExam() {
        if (this.completed) return;
        this.completed = true;
        if (this.timer) clearInterval(this.timer);

        this.calculateScore();

        const payload = {
            user_id: this.auth.currentUser()?.id,
            exam_id: this.exam.id,
            score: this.score,
            total_questions: this.questions.length
        };

        this.api.submitResult(payload).subscribe({
            next: () => {
                console.log('Result submitted');
                this.cdr.detectChanges();
            },
            error: (err) => console.error(err)
        });
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach(q => {
            if (this.answers[q.id] === q.correct_option) {
                this.score++;
            }
        });
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}
