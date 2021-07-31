import { UseGuards } from '@nestjs/common';
import {
  Args,
  Directive,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map, throwIfEmpty } from 'rxjs/operators';
import { GqlUser } from '../../authz/gql-user.decorator';
import { JwtAuthGuard } from '../../authz/jwt-auth.guard';
import { UserPrincipal } from '../../authz/user-principal.interface';
import { Post } from '../../gql/types/post.model';
import { User } from '../../gql/types/user.model';
import { UpdateUserResult } from '../types/update-result.model';
import { PostsService } from '../service/posts.service';
import { UsersService } from '../service/users.service';
import { UserNotFoundError } from './user-not-found.error';

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
    return this.usersService
      .findById(id)
      .pipe(throwIfEmpty(() => new UserNotFoundError(id)));
  }

  @ResolveField((of) => [Post])
  public posts(@Parent() user: User): Observable<Post[]> {
    return this.postsService.findByAuthor(user.id);
  }

  @Mutation((returns) => UpdateUserResult)
  @UseGuards(JwtAuthGuard)
  updateUser(@GqlUser() user: UserPrincipal): Observable<UpdateUserResult> {
    console.log('gql user:', user);
    const { userId, email, name } = user;
    return this.usersService.update({ id: userId, email, name }).pipe(
      map((b) => ({
        success: b,
      })),
    );
  }
}
