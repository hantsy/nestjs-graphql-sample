import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
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
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    DatePipe,
    SlicePipe,
  ],
  templateUrl: './post-list.html',
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();

  posts = signal<Post[]>([]);
  loading = signal(true);
  totalCount = signal(0);
  keyword = '';
  pageSize = signal(25);
  pageIndex = signal(0);

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          if (data) {
            this.posts.set(data.posts);
            this.totalCount.set(data.postCount);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('loadPosts error:', err);
          this.loading.set(false);
        },
      });
  }

  deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService
        .deletePost(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.loadPosts(),
          error: (err) => console.error('deletePost error:', err),
        });
    }
  }
}
