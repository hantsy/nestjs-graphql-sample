import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsDataInitializer } from './posts-data-initializer';
import { CommentRepository } from './repository/comment.repository';
import { PostRepository } from './repository/post.repository';
import { UserRepository } from './repository/user.repository';
import { databaseConnectionProviders } from './database-connection.providers';
import { ConfigModule } from '@nestjs/config';
import dbConfig from '../config/db.config';

@Module({
  // imports: [
  //   TypeOrmModule.forFeature([
  //     PostRepository,
  //     UserRepository,
  //     CommentRepository,
  //   ]),
  // ],
  // exports: [TypeOrmModule],
  imports: [ConfigModule.forFeature(dbConfig)],
  providers: [PostsDataInitializer, ...databaseConnectionProviders],
  exports: [...databaseConnectionProviders],
})
export class DatabaseModule {}
