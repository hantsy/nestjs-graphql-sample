import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PostService } from './post.service';
import { PostFormComponent } from './post-form';

@Component({
  selector: 'app-post-create',
  imports: [MatCardModule, PostFormComponent],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Create New Post</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-post-form
          submitLabel="Create Post"
          cancelLink="/posts"
          (submitted)="onSubmit($event)"
        />
      </mat-card-content>
    </mat-card>
  `,
})
export class PostCreateComponent {
  private postService = inject(PostService);
  private router = inject(Router);

  onSubmit(data: { title: string; content: string }) {
    this.postService.createPost(data.title, data.content).subscribe(({ data }) => {
      if (data?.createPost) {
        this.router.navigate(['/posts', data.createPost.id]);
      }
    });
  }
}
