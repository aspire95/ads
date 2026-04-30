import { Component, signal } from '@angular/core';
import { StudentFormComponent } from './components/student-form/student-form.component';

@Component({
  selector: 'app-root',
  imports: [StudentFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
