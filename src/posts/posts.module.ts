import { Module } from '@nestjs/common';
import { PostsResolver } from './service/posts.resolver';
import { PostsService } from './service/posts.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
