import { Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { UsersResolver } from './service/users.resolver';
import { UsersService } from './service/users.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, PostsModule],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
