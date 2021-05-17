import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
// import plugin from 'apollo-server-plugin-operation-registry';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // in memory
      //autoSchemaFile: true,
      sortSchema: true,

      buildSchemaOptions: {
        //fieldMiddleware: [loggerMiddleware],
        //dateScalarMode: 'timestamp', // by default, GraphQLISODateTime (e.g. 2019-12-03T09:54:33Z)
        numberScalarMode: 'integer', //default, it is float.
      },
      schemaDirectives: {
        //upper: UpperCaseDirective,
      },
      fieldResolverEnhancers: ['interceptors'],
    }),

    PostsModule,
    UsersModule,
    DatabaseModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
