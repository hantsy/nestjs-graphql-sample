import { Args, Int, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { UpvotePostInput } from './dto/upvote-post.input';
import { Post } from './models/post.model';
import { Comment } from './models/comment.model';
import { PostsService } from './posts.service';
import { PubSub } from 'graphql-subscriptions';
import { CommentInput } from './dto/comment.input';
import { User } from 'src/common/user.decorator';
const pubSub = new PubSub();

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation((returns) => Post)
  async upvotePost(
    @Args('upvotePostData') upvotePostData: UpvotePostInput,
    // @User() user: UserEntity,
  ) {
    //this.postsService.upvoteById(upvotePostData);
  }

  @Mutation((returns) => Post)
  async addComment(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('comment') comment: CommentInput,
  ) {
    const newComment = this.postsService.addComment({ id: postId, comment });
    pubSub.publish('commentAdded', { commentAdded: newComment });
    return newComment;
  }

  @Subscription((returns) => Comment, {
    name: 'commentAdded',
  })
  addCommentHandler() {
    return pubSub.asyncIterator('commentAdded');
  }
}
