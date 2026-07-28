import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PostService, Post } from './post.service';

@Component({
  selector: 'app-post-detail',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatListModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './post-detail.html',
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private destroyRef = inject(DestroyRef);

  post = signal<Post | null>(null);
  loading = signal(true);
  commentSubmitting = signal(false);
  newComment = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.loading.set(true);
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

  addComment() {
    if (!this.newComment.trim() || !this.post()) return;
    const content = this.newComment.trim();
    this.commentSubmitting.set(true);
    this.postService
      .addComment(this.post()!.id, content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.newComment = '';
          this.commentSubmitting.set(false);
          this.loadPost(this.post()!.id);
        },
        error: (err) => {
          console.error('addComment error:', err);
          this.commentSubmitting.set(false);
        },
      });
  }

  avatarColor(id: string): string {
    const colors = ['#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#009688','#4caf50','#ff9800','#795548','#607d8b'];
    let hash = 0;
    for (let i = 0; i < id.length; i++) { hash = id.charCodeAt(i) + ((hash << 5) - hash); }
    return colors[Math.abs(hash) % colors.length];
  }

  avatarLetter(content: string): string {
    return content.trim().charAt(0).toUpperCase();
  }

  onDelete() {
    if (this.post() && confirm('Are you sure you want to delete this post?')) {
      this.postService
        .deletePost(this.post()!.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/posts']),
          error: (err) => console.error('deletePost error:', err),
        });
    }
  }
}
