import { Component, input, output, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-form',
  imports: [FormsModule, RouterLink, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule],
  templateUrl: './post-form.html',
})
export class PostFormComponent implements OnInit {
  title = '';
  content = '';

  submitLabel = input<string>('Save');
  cancelLink = input<string>('/posts');
  initialTitle = input<string>('');
  initialContent = input<string>('');
  submitting = input<boolean>(false);
  submitted = output<{ title: string; content: string }>();

  ngOnInit() {
    if (this.initialTitle()) this.title = this.initialTitle();
    if (this.initialContent()) this.content = this.initialContent();
  }

  onSubmit() {
    if (this.title.trim() && this.content.trim()) {
      this.submitted.emit({
        title: this.title.trim(),
        content: this.content.trim(),
      });
      this.title = '';
      this.content = '';
    }
  }
}
