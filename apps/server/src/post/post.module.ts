import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { Comment, CommentSchema } from './comment.schema';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostDataInitializerService } from './post-data-initializer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  providers: [PostService, PostResolver, PostDataInitializerService],
  exports: [PostService],
})
export class PostModule {}
