import { Module } from '@nestjs/common';
import { PostsResolver } from './service/posts.resolver';
import { PostsService } from './service/posts.service';
import { DatabaseModule } from '../database/database.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [DatabaseModule],
  providers: [
    PostsService,
    PostsResolver,
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
