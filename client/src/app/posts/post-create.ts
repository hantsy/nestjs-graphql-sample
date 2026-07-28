import { Component, inject, signal, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PostService } from './post.service';
import { PostFormComponent } from './post-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-create',
  imports: [MatCardModule, PostFormComponent],
  templateUrl: './post-create.html',
})
export class PostCreateComponent {
  private postService = inject(PostService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  submitting = signal(false);
  error = signal<string | null>(null);

  onSubmit(data: { title: string; content: string }) {
    this.error.set(null);
    this.submitting.set(true);
    this.postService
      .createPost(data.title, data.content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.submitting.set(false);
          if (data?.createPost) {
            this.router.navigate(['/posts', data.createPost.id]);
          } else {
            this.error.set('Unexpected response from server.');
          }
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err.message || 'Failed to create post. Please try again.');
          console.error('createPost error:', err);
        },
      });
  }
}
