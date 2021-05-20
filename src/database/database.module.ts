import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from '../config/db.config';
import { databaseConnectionProviders } from './database-connection.providers';
import { databaseRepositoriesProviders } from './database-repositories.providers';
import { PostsDataInitializer } from './posts-data-initializer';

@Module({
  imports: [ConfigModule.forFeature(dbConfig)],
  providers: [
    PostsDataInitializer,
    ...databaseConnectionProviders,
    ...databaseRepositoriesProviders,
  ],
  exports: [...databaseConnectionProviders, ...databaseRepositoriesProviders],
})
export class DatabaseModule {}
