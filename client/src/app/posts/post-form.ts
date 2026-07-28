import { Component, input, output, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-post-form',
  imports: [FormsModule, RouterLink, MatInputModule, MatButtonModule, MatFormFieldModule],
  template: `
    <mat-form-field class="full-width" appearance="outline">
      <mat-label>Title</mat-label>
      <input matInput [(ngModel)]="title" required />
    </mat-form-field>

    <mat-form-field class="full-width" appearance="outline">
      <mat-label>Content</mat-label>
      <textarea matInput [(ngModel)]="content" rows="10" required></textarea>
    </mat-form-field>

    <button
      mat-raised-button
      color="primary"
      [disabled]="!title.trim() || !content.trim() || content.trim().length < 10"
      (click)="onSubmit()"
    >
      {{ submitLabel() }}
    </button>
    <button mat-button [routerLink]="cancelLink()" style="margin-left: 8px;">
      Cancel
    </button>
  `,
})
export class PostFormComponent {
  title = '';
  content = '';

  submitLabel = input<string>('Save');
  cancelLink = input<string>('/posts');
  initialTitle = input<string>('');
  initialContent = input<string>('');
  submitted = output<{ title: string; content: string }>();

  constructor() {
    effect(() => {
      const t = this.initialTitle();
      if (t) this.title = t;
    });
    effect(() => {
      const c = this.initialContent();
      if (c) this.content = c;
    });
  }

  onSubmit() {
    if (this.title.trim() && this.content.trim()) {
      this.submitted.emit({
        title: this.title.trim(),
        content: this.content.trim(),
      });
    }
  }
}
