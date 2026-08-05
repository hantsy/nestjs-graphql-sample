import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PostService, Post } from './post.service';
import { PostFormComponent } from './post-form';

@Component({
  selector: 'app-post-edit',
  imports: [MatCardModule, MatIconModule, PostFormComponent],
  templateUrl: './post-edit.html',
})
export class PostEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private destroyRef = inject(DestroyRef);

  post = signal<Post | null>(null);
  loading = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postService
        .getPost(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: ({ data }) => {
            if (data) this.post.set(data.post);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('getPost error:', err);
            this.loading.set(false);
          },
        });
    }
  }

  onSubmit(data: { title: string; content: string }) {
    if (!this.post()) return;
    this.error.set(null);
    this.submitting.set(true);
    this.postService
      .updatePost(this.post()!.id, data.title, data.content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/posts', this.post()!.id]);
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err.message || 'Failed to update post. Please try again.');
          console.error('updatePost error:', err);
        },
      });
  }
}
