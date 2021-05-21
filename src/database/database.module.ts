import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsDataInitializer } from './posts-data-initializer';
import { CommentRepository } from './repository/comment.repository';
import { PostRepository } from './repository/post.repository';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      UserRepository,
      CommentRepository,
    ]),
  ],
  exports: [TypeOrmModule],
  providers: [PostsDataInitializer],
})
export class DatabaseModule {}
