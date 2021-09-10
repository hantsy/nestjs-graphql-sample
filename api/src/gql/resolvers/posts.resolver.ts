import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Observable } from 'rxjs';
import { tap, throwIfEmpty } from 'rxjs/operators';
import { GqlUser } from '../../authz/gql-user.decorator';
import { HasPermissions } from '../../authz/has-permissions.decorator';
import { HasPermissionsGuard } from '../../authz/has-permissions.guard';
import { JwtAuthGuard } from '../../authz/jwt-auth.guard';
import { PermissionType } from '../../authz/permission-type.enum';
import { UserPrincipal } from '../../authz/user-principal.interface';
import { CommentInput } from '../dto/comment.input';
import { PostInput } from '../dto/post.input';
import { PostsArgs } from '../dto/posts.arg';
import { Comment } from '../types/comment.model';
import { Post } from '../types/post.model';
import PostsLoaders from '../dataloaders/posts.loaders';
import { PostsService } from '../service/posts.service';
import { PostNotFoundError } from './post-not-found.error';
import { User } from '../types/user.model';

@Resolver((of) => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsLoaders: PostsLoaders,
    private readonly pubSub: PubSub,
  ) {}

  // @Query(() => [Post])
  // async posts(
  //   @Info() info: GraphQLResolveInfo
  // ) {
  //   const parsedInfo = parseResolveInfo(info) as ResolveTree;
  //   const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
  //     parsedInfo,
  //     info.returnType
  //   );

  //   const posts = 'author' in simplifiedInfo.fields
  //     ? await this.postsService.getPostsWithAuthors()
  //     : await this.postsService.getPosts();

  //   return posts.items;
  // }

  @Query((returns) => Post)
  getPostById(@Args('postId', ParseUUIDPipe) id: string): Observable<Post> {
    return this.postsService
      .findById(id)
      .pipe(throwIfEmpty(() => new PostNotFoundError(id)));
  }

  @Query((returns) => [Post])
  getAllPosts(@Args() postsArg: PostsArgs): Observable<Post[]> {
    return this.postsService.findAll(postsArg);
  }

  @ResolveField('author', (of) => User)
  async getAuthor(@Parent() post: Post): Promise<User> {
    const { authorId } = post;
    console.log('resovle author field:', authorId);
    return await this.postsLoaders.loadAuthors.load(authorId);
  }

  // @ResolveField((of) => [Comment])
  // public comments(@Parent() post: Post): Observable<Comment[]> {
  //   return this.postsService.findCommentsOfPost(post.id);
  // }

  @ResolveField((of) => [Comment])
  async comments(@Parent() post: Post): Promise<Comment[]> {
    return await this.postsLoaders.loadComments.load(post.id);
  }

  @Mutation((returns) => Post)
  @UseGuards(JwtAuthGuard, HasPermissionsGuard)
  @HasPermissions(PermissionType.WRITE_POSTS)
  createPost(
    @GqlUser() user: UserPrincipal,
    @Args('createPostInput') data: PostInput,
  ): Observable<Post> {
    return this.postsService.createPost(user.userId, data);
  }

  @Mutation((returns) => Comment)
  @UseGuards(JwtAuthGuard, HasPermissionsGuard)
  @HasPermissions(PermissionType.WRITE_POSTS)
  addComment(
    @Args('commentInput', ParseUUIDPipe) commentInput: CommentInput,
  ): Observable<Comment> {
    return this.postsService
      .addComment(commentInput.postId, commentInput.content)
      .pipe(
        tap((c) => this.pubSub.publish('commentAdded', { commentAdded: c })),
      );
  }

  @Subscription((returns) => Comment, { name: 'commentAdded' })
  addCommentHandler() {
    return this.pubSub.asyncIterator('commentAdded');
  }
}
