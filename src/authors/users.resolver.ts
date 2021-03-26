import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/models/post.model';
import { User } from './models/user.entity';

@Resolver((of) => User)
export class UsersResolvers {
  constructor(private readonly postsService: PostsService) {}

  @ResolveField((of) => [Post])
  public posts(@Parent() user: User): Post[] {
    return this.postsService.forAuthor(user.id);
  }
}
