import { join } from 'path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UpperCaseDirective } from './common/upper-case.directive';
import plugin from 'apollo-server-plugin-operation-registry';
import { loggerMiddleware } from './common/logger.middleware';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      debug: true,
      playground: true,
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
        upper: UpperCaseDirective,
      },
      plugins: [
        plugin({
          /* options */
        }),
      ],
      fieldResolverEnhancers: ['interceptors'],
    }),

    CommonModule,
    PostsModule,
    UsersModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
