import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthzModule } from './authz/authz.module';
import { DatabaseModule } from './database/database.module';
// import plugin from 'apollo-server-plugin-operation-registry';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    DatabaseModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      debug: true,
      playground: true, //show playgroud
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
    AuthzModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
