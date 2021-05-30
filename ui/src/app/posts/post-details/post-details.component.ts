import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Subscription } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment.model';
import { Post } from '../shared/post.model';
import { PostService } from '../shared/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  postId?: string;
  post: Post = { title: '', content: '' };
  comments: Comment[] = [];
  sub?: Subscription;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('calling ngOnInit::PostDetailsComponent... ');
    this.sub = this.route.params
      .pipe(
        switchMap((params) => {
          this.postId = params['id'];

          if (!this.postId)
            throw new Error('request parameter post id is required.');

          return this.postService.getPost(this.postId).pipe(
            map(({ error, data }: ApolloQueryResult<any>, index) => {
              if (error) throw error;
              return data?.getPostById;
            })
          );
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.post = res;
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
