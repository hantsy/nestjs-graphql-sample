import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { PostService } from './post.service';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable()
export class PostDetailsResolve implements Resolve<Post> {
  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const postId = route.paramMap.get('id');
    let data: Post;
    if (!postId) throw Error('post id is required');
    return this.postService.getPost(postId).pipe(
      map(({ error, data }: ApolloQueryResult<any>, index) => {
        if (error) throw error;
        return data?.getPostById;
      })
    );
  }
}
