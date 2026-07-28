import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostType, CommentType } from './post.type';
import { CreatePostInput, UpdatePostInput, CreateCommentInput } from './dto/post.input';
import { PostsArgs } from './dto/posts.args';

@Resolver(() => PostType)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [PostType], { name: 'posts' })
  async getPosts(@Args() args: PostsArgs): Promise<PostType[]> {
    const posts = await this.postService.findAll(args);
    return posts.map((post) => this.toPostType(post));
  }

  @Query(() => Int, { name: 'postCount' })
  async getPostCount(@Args() args: PostsArgs): Promise<number> {
    return this.postService.countAll(args);
  }

  @Query(() => PostType, { name: 'post' })
  async getPost(@Args('id') id: string): Promise<PostType> {
    const post = await this.postService.findById(id);
    return this.toPostType(post);
  }

  @Mutation(() => PostType)
  async createPost(@Args('input') input: CreatePostInput): Promise<PostType> {
    const post = await this.postService.create(input);
    return this.toPostType(post);
  }

  @Mutation(() => PostType)
  async updatePost(
    @Args('id') id: string,
    @Args('input') input: UpdatePostInput,
  ): Promise<PostType> {
    const post = await this.postService.update(id, input);
    return this.toPostType(post);
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string): Promise<boolean> {
    return this.postService.delete(id);
  }

  @Mutation(() => CommentType)
  async addComment(
    @Args('input') input: CreateCommentInput,
  ): Promise<CommentType> {
    const comment = await this.postService.addComment(
      input.postId,
      input,
    );
    return this.toCommentType(comment);
  }

  @ResolveField('comments', () => [CommentType])
  async comments(@Parent() post: PostType): Promise<CommentType[]> {
    const comments = await this.postService.commentsOf(post.id);
    return comments.map((comment) => this.toCommentType(comment));
  }

  private toPostType(post: any): PostType {
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private toCommentType(comment: any): CommentType {
    return {
      id: comment._id.toString(),
      content: comment.content,
      postId: comment.post.toString(),
      createdAt: comment.createdAt,
    };
  }
}
