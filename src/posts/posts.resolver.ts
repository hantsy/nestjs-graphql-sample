import { PubSub } from 'graphql-subscriptions';

import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';

import { CommentInput } from './dto/comment.input';
import { UpvotePostInput } from './dto/upvote-post.input';
import { Comment } from './models/comment.model';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { NotFoundException } from '@nestjs/common';
import { PostsArgs } from './dto/posts.arg';

const pubSub = new PubSub();

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query((returns) => Post)
  async getPostById(@Args('id') id: string): Promise<Post> {
    const recipe = await this.postsService.findById(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  @Query((returns) => [Post])
  async allPosts(@Args() postsArg: PostsArgs): Promise<Post[]> {
    return await this.postsService.findAll({
      q: postsArg.keyword,
      offset: postsArg.skip,
      limit: postsArg.take,
    });
  }

  @Mutation((returns) => Post)
  async createPost(data: CreatePostInput) {
    this.postsService.createPost(data);
  }

  @Mutation((returns) => Post)
  async upvotePost(
    @Args('upvotePostData') upvotePostData: UpvotePostInput,
    // @User() user: UserEntity,
  ) {
    return await this.postsService.upvoteById(upvotePostData.postId);
  }

  @Mutation((returns) => Post)
  async addComment(
    @Args('postId', { type: () => String }) postId: string,
    @Args('comment') comment: CommentInput,
  ) {
    const newComment = await this.postsService.addComment(
      postId,
      comment.content,
    );
    pubSub.publish('commentAdded', { commentAdded: newComment });
    return newComment;
  }

  @Subscription((returns) => Comment, { name: 'commentAdded' })
  addCommentHandler() {
    return pubSub.asyncIterator('commentAdded');
  }
}
