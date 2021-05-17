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
import { tap } from 'rxjs/operators';
import { CreatePostInput } from '../dto/create-post.input';
import { PostsArgs } from '../dto/posts.arg';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { PostsService } from './posts.service';

const pubSub = new PubSub();

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query((returns) => Post)
  getPostById(@Args('id') id: string): Observable<Post> {
    return this.postsService.findById(id);
  }

  @Query((returns) => [Post])
  getAllPosts(@Args() postsArg: PostsArgs): Observable<Post[]> {
    return this.postsService.findAll(postsArg);
  }

  @Mutation((returns) => Post)
  createPost(@Args('createPostInput') data: CreatePostInput): Observable<Post> {
    return this.postsService.createPost(data);
  }

  @ResolveField((of) => [Comment])
  public comments(@Parent() post: Post): Observable<Comment[]> {
    return this.postsService.findCommentsOfPost(post.id);
  }

  @Mutation((returns) => Post)
  addComment(
    @Args('postId', { type: () => String }) postId: string,
    @Args('comment', { type: () => String }) comment: string,
  ): Observable<Comment> {
    return this.postsService
      .addComment(postId, comment)
      .pipe(tap((c) => pubSub.publish('commentAdded', { commentAdded: c })));
  }

  @Subscription((returns) => Comment, { name: 'commentAdded' })
  addCommentHandler() {
    return pubSub.asyncIterator('commentAdded');
  }
}
