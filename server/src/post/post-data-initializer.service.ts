import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class PostDataInitializerService implements OnModuleInit {
  private readonly logger = new Logger(PostDataInitializerService.name);

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async onModuleInit() {
    if (process.env.SEED_DATABASE === 'true') {
      this.logger.log('Seeding database...');

      await this.postModel.deleteMany({});
      await this.commentModel.deleteMany({});

      const post1 = await this.postModel.create({
        title: 'Getting Started with NestJS',
        content:
          'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. It uses TypeScript and combines elements of OOP, FP, and FRP.',
      });

      const post2 = await this.postModel.create({
        title: 'Introduction to GraphQL',
        content:
          'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. It provides a complete and understandable description of the data in your API.',
      });

      const post3 = await this.postModel.create({
        title: 'MongoDB with Mongoose',
        content:
          'Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, and business logic hooks.',
      });

      await this.commentModel.create({
        content: 'Great article! Very helpful for beginners.',
        post: post1._id,
      });

      await this.commentModel.create({
        content: 'Thanks for sharing. Looking forward to more content.',
        post: post1._id,
      });

      await this.commentModel.create({
        content: 'GraphQL is amazing! We use it in production.',
        post: post2._id,
      });

      await this.commentModel.create({
        content: 'Mongoose makes MongoDB so much easier to work with.',
        post: post3._id,
      });

      const count = await this.postModel.countDocuments();
      const commentCount = await this.commentModel.countDocuments();
      this.logger.log(
        `Seeded ${count} posts and ${commentCount} comments.`,
      );
    }
  }
}
