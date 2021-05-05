import { PubSub } from 'graphql-subscriptions';

import { Args, Int, Mutation, Resolver, Subscription } from '@nestjs/graphql';

import { CommentInput } from './dto/comment.input';
import { UpvotePostInput } from './dto/upvote-post.input';
import { Comment } from './models/comment.model';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';

const pubSub = new PubSub();

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation((returns) => Post)
  async upvotePost(
    @Args('upvotePostData') upvotePostData: UpvotePostInput,
    // @User() user: UserEntity,
  ) {
    this.postsService.upvoteById(upvotePostData.postId);
  }

  @Mutation((returns) => Post)
  async addComment(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('comment') comment: CommentInput,
  ) {
    const newComment = this.postsService.addComment(postId, comment.content);
    pubSub.publish('commentAdded', { commentAdded: newComment });
    return newComment;
  }

  @Subscription((returns) => Comment, { name: 'commentAdded' })
  addCommentHandler() {
    return pubSub.asyncIterator('commentAdded');
  }
}
