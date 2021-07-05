import { Module } from '@nestjs/common';
import { PostsResolver } from '../gql-api/resolvers/posts.resolver';
import { PostsService } from './service/posts.service';
import { DatabaseModule } from '../database/database.module';
import { PubSub } from 'graphql-subscriptions';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersService } from './service/users.service';
import PostsLoaders from './service/posts.loaders';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
    PostsResolver,
    UsersResolver,
    UsersService,
    PostsService,
    PostsLoaders,
  ],
  exports: [],
})
export class GqlApiModule {}
