import { Injectable, Scope } from '@nestjs/common';
import { UsersService } from './users.service';
import * as DataLoader from 'dataloader';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export default class PostsLoaders {
  constructor(private usersService: UsersService) {}

  public readonly batchAuthors = new DataLoader((authorIds: string[]) => {
    console.log('dataloaders: ', authorIds);
    return lastValueFrom(
      this.usersService.getByIds(authorIds).pipe(
        map((users) => new Map(users.map((user) => [user.id, user]))),
        map((usersMap) => {
          return authorIds.map((authorId) => usersMap.get(authorId));
        }),
      ),
    );
  });
}
