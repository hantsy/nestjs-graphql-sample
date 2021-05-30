import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../shared/post.model';
import { Subscription } from 'rxjs';
import { PostService } from '../shared/post.service';
import { Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  q = null;
  posts: Post[] = [];
  sub?: Subscription;
  error: any;
  loading = true;

  constructor(private router: Router, private postService: PostService) {}

  search() {
    this.sub = this.postService
      .getPosts({ q: this.q })
      .subscribe(({ loading, data, error }: ApolloQueryResult<any>) => {
        this.posts = data?.getAllPosts;
        this.loading = loading;
        this.error = error;
      });
  }

  searchByTerm($event: any) {
    console.log('search by term:' + $event);
    this.updateTerm($event);
    this.search();
  }

  updateTerm($event: any) {
    console.log('update term:' + $event);
    this.q = $event;
  }

  clearTerm($event: any) {
    console.log('clear term:' + $event);
    this.q = null;
  }

  addPost() {
    this.router.navigate(['', 'posts', 'new']);
  }

  ngOnInit() {
    console.log('calling ngOnInit::PostListComponent');
    this.search();
  }

  ngOnDestroy() {
    console.log('calling ngOnDestroy::PostListComponent');
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
