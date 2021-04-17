import { Module } from '@nestjs/common';
import { UsersResolvers } from './users.resolver';
import { UsersService } from './users.service';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PostsModule],
  providers: [UsersService, UsersResolvers],
})
export class UsersModule {}
