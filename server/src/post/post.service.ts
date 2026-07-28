import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { Comment, CommentDocument } from './comment.schema';
import { CreatePostInput, UpdatePostInput, CreateCommentInput } from './dto/post.input';
import { PostsArgs } from './dto/posts.args';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async findAll(args: PostsArgs): Promise<PostDocument[]> {
    const { keyword, skip = 0, take = 25 } = args;
    const filter = keyword
      ? { title: { $regex: keyword, $options: 'i' } }
      : {};
    return this.postModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(take)
      .exec();
  }

  async countAll(args: PostsArgs): Promise<number> {
    const { keyword } = args;
    const filter = keyword
      ? { title: { $regex: keyword, $options: 'i' } }
      : {};
    return this.postModel.countDocuments(filter).exec();
  }

  async findById(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with id "${id}" not found`);
    }
    return post;
  }

  async create(input: CreatePostInput): Promise<PostDocument> {
    const post = new this.postModel(input);
    return post.save();
  }

  async update(id: string, input: UpdatePostInput): Promise<PostDocument> {
    const post = await this.postModel
      .findByIdAndUpdate(id, input, { new: true })
      .exec();
    if (!post) {
      throw new NotFoundException(`Post with id "${id}" not found`);
    }
    return post;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Post with id "${id}" not found`);
    }
    // also delete associated comments
    await this.commentModel.deleteMany({ post: new Types.ObjectId(id) }).exec();
    return true;
  }

  async addComment(
    postId: string,
    input: CreateCommentInput,
  ): Promise<CommentDocument> {
    const post = await this.findById(postId);
    const comment = new this.commentModel({
      content: input.content,
      post: post._id,
    });
    return comment.save();
  }

  async commentsOf(postId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ post: new Types.ObjectId(postId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteAll(): Promise<void> {
    await this.postModel.deleteMany({}).exec();
    await this.commentModel.deleteMany({}).exec();
  }
}
