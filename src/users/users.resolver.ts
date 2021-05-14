import {
  Args,
  Directive,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/models/post.model';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolvers {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Directive(
    '@deprecated(reason: "This query will be removed in the next version")',
  )
  @Query((returns) => User, { name: 'author' })
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOneById(id);
  }

  @ResolveField((of) => [Post])
  public posts(@Parent() user: User): Promise<Post[]> {
    return this.postsService.findByAuthor(user.id);
  }
}
