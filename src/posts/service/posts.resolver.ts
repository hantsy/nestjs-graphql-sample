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
import { AuthGuard } from '@nestjs/passport';
import { PubSub } from 'graphql-subscriptions';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommentInput } from '../dto/comment.input';
import { CreatePostInput } from '../dto/create-post.input';
import { PostsArgs } from '../dto/posts.arg';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../../authz/jwt-auth.guard';
import { HasPermissionsGuard } from '../../authz/has-permissions.guard';
import { HasPermissions } from '../../authz/has-permissions.decorator';
import { PermissionType } from '../../authz/permission-type.enum';

@Resolver((of) => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly pubSub: PubSub,
  ) {}

  @Query((returns) => Post)
  getPostById(@Args('postId', ParseUUIDPipe) id: string): Observable<Post> {
    return this.postsService.findById(id);
  }

  @Query((returns) => [Post])
  getAllPosts(@Args() postsArg: PostsArgs): Observable<Post[]> {
    return this.postsService.findAll(postsArg);
  }

  @ResolveField((of) => [Comment])
  public comments(@Parent() post: Post): Observable<Comment[]> {
    return this.postsService.findCommentsOfPost(post.id);
  }

  @Mutation((returns) => Post)
  @UseGuards(JwtAuthGuard, HasPermissionsGuard)
  @HasPermissions(PermissionType.WRITE_POSTS)
  createPost(@Args('createPostInput') data: CreatePostInput): Observable<Post> {
    return this.postsService.createPost(data);
  }

  @Mutation((returns) => Comment)
  @UseGuards(JwtAuthGuard, HasPermissionsGuard)
  @HasPermissions(PermissionType.WRITE_POSTS)
  addComment(
    @Args('commentInput') commentInput: CommentInput,
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
