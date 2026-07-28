import { Component, signal, inject, OnInit } from '@angular/core';
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
  template: `
    @if (loading()) {
      <p>Loading post...</p>
    } @else if (post()) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ post()!.title }}</mat-card-title>
          <mat-card-subtitle>
            Created {{ post()!.createdAt | date:'medium' }}
            @if (post()!.updatedAt !== post()!.createdAt) {
              · Updated {{ post()!.updatedAt | date:'medium' }}
            }
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p style="white-space: pre-wrap;">{{ post()!.content }}</p>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button [routerLink]="['/posts', post()!.id, 'edit']">
            <mat-icon>edit</mat-icon> Edit
          </a>
          <button mat-button color="warn" (click)="onDelete()">
            <mat-icon>delete</mat-icon> Delete
          </button>
          <a mat-button routerLink="/posts">Back to Posts</a>
        </mat-card-actions>
      </mat-card>

      <mat-card style="margin-top: 16px;">
        <mat-card-header>
          <mat-card-title>Comments</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (post()!.comments && post()!.comments!.length > 0) {
            <mat-list>
              @for (comment of post()!.comments; track comment.id) {
                <mat-list-item>
                  <span matListItemTitle>{{ comment.content }}</span>
                  <span matListItemLine>{{ comment.createdAt | date:'medium' }}</span>
                </mat-list-item>
                <mat-divider />
              }
            </mat-list>
          } @else {
            <p>No comments yet. Be the first to comment!</p>
          }

          <div style="margin-top: 16px; display: flex; gap: 8px; align-items: baseline;">
            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Add a comment</mat-label>
              <textarea matInput [(ngModel)]="newComment" rows="2" placeholder="Write your comment..."></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="addComment()" [disabled]="!newComment.trim()">
              Post
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);

  post = signal<Post | null>(null);
  loading = signal(true);
  newComment = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.loading.set(true);
    this.postService.getPost(id).subscribe(({ data }) => {
      this.post.set(data.post);
      this.loading.set(false);
    });
  }

  addComment() {
    if (!this.newComment.trim() || !this.post()) return;
    const content = this.newComment.trim();
    this.postService.addComment(this.post()!.id, content).subscribe(() => {
      this.newComment = '';
      this.loadPost(this.post()!.id);
    });
  }

  onDelete() {
    if (this.post() && confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post()!.id).subscribe(() => {
        this.router.navigate(['/posts']);
      });
    }
  }
}
