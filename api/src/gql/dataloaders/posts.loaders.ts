import { Injectable, Scope } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import * as DataLoader from 'dataloader';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { PostsService } from '../service/posts.service';

@Injectable({ scope: Scope.REQUEST })
export default class PostsLoaders {
  constructor(
    private postService: PostsService,
    private usersService: UsersService,
  ) {}

  public readonly loadAuthors = new DataLoader((authorIds: string[]) => {
    console.log('dataloaders: ', authorIds);
    return lastValueFrom(
      this.usersService.findByIds(authorIds).pipe(
        map((users) => new Map(users.map((user) => [user.id, user]))),
        map((usersMap) => {
          return authorIds.map((authorId) => usersMap.get(authorId));
        }),
      ),
    );
  });

  public readonly loadComments = new DataLoader((postIds: string[]) => {
    console.log('dataloaders: ', postIds);
    return lastValueFrom(
      this.postService.findCommentsByPostIds(postIds).pipe(
        map((comments) => {
          return postIds.map((postId) =>
            comments.filter((c) => c.postId == postId),
          );
        }),
      ),
    );
  });
}
