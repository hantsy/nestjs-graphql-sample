import {
  Args,
  Directive,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PostsService } from '../../posts/service/posts.service';
import { Post } from '../../posts/models/post.model';
import { User } from '../models/user.model';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Directive(
    '@deprecated(reason: "This query will be removed in the next version")',
  )
  @Query((returns) => User, { name: 'author' })
  getUserById(@Args('userId') id: string): Observable<User> {
    return this.usersService.findById(id);
  }

  @ResolveField((of) => [Post])
  public posts(@Parent() user: User): Observable<Post[]> {
    return this.postsService.findByAuthor(user.id);
  }
}
