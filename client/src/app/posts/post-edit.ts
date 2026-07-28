import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PostService, Post } from './post.service';
import { PostFormComponent } from './post-form';

@Component({
  selector: 'app-post-edit',
  imports: [MatCardModule, PostFormComponent],
  template: `
    @if (post()) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>Edit Post</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-post-form
            submitLabel="Update Post"
            cancelLink="/posts"
            [initialTitle]="post()!.title"
            [initialContent]="post()!.content"
            (submitted)="onSubmit($event)"
          />
        </mat-card-content>
      </mat-card>
    } @else {
      <p>Loading post...</p>
    }
  `,
})
export class PostEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);

  post = signal<Post | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postService.getPost(id).subscribe(({ data }) => {
        if (data) this.post.set(data.post);
      });
    }
  }

  onSubmit(data: { title: string; content: string }) {
    if (!this.post()) return;
    this.postService
      .updatePost(this.post()!.id, data.title, data.content)
      .subscribe(() => {
        this.router.navigate(['/posts', this.post()!.id]);
      });
  }
}
