import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { DatePipe, SlicePipe } from '@angular/common';
import { PostService, Post } from './post.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-post-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    DatePipe,
    SlicePipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Posts</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Search posts</mat-label>
          <input matInput [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search by title..." />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        @if (loading()) {
          <p>Loading posts...</p>
        } @else if (posts().length === 0) {
          <p>No posts found.</p>
        } @else {
          @for (post of posts(); track post.id) {
            <mat-card appearance="outlined" style="margin-bottom: 8px;">
              <mat-card-header>
                <mat-card-title>
                  <a [routerLink]="['/posts', post.id]">{{ post.title }}</a>
                </mat-card-title>
                <mat-card-subtitle>
                  {{ post.createdAt | date:'medium' }}
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>{{ post.content | slice:0:200 }}{{ post.content.length > 200 ? '...' : '' }}</p>
              </mat-card-content>
              <mat-card-actions>
                <a mat-button [routerLink]="['/posts', post.id]">Read</a>
                <a mat-button [routerLink]="['/posts', post.id, 'edit']">Edit</a>
                <button mat-button color="warn" (click)="deletePost(post.id)">Delete</button>
              </mat-card-actions>
            </mat-card>
          }

          <mat-paginator
            [length]="totalCount()"
            [pageSize]="pageSize()"
            [pageIndex]="pageIndex()"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
          />
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private searchSubject = new Subject<string>();

  posts = signal<Post[]>([]);
  loading = signal(true);
  totalCount = signal(0);
  keyword = '';
  pageSize = signal(25);
  pageIndex = signal(0);

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadPosts();
      });
    this.loadPosts();
  }

  onSearch() {
    this.searchSubject.next(this.keyword);
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    this.postService
      .getPosts(this.keyword, this.pageIndex() * this.pageSize(), this.pageSize())
      .subscribe(({ data }) => {
        this.posts.set(data.posts);
        this.totalCount.set(data.postCount);
        this.loading.set(false);
      });
  }

  deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe(() => {
        this.loadPosts();
      });
    }
  }
}
