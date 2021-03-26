import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLFederationModule, GraphQLModule } from '@nestjs/graphql';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from './common/common.module';
import { join } from 'path';
import { AuthorsModule } from './authors/authors.module';
import { RecipesModule } from './recipes/recipes.module';
import { UpperCaseDirective } from './common/upper-case.directive';
import ApolloServerOperationRegistry from 'apollo-server-plugin-operation-registry';
import { loggerMiddleware } from './common/logger.middleware';
import { User } from './authors/models/user.entity';
@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),
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
        ApolloServerOperationRegistry({
          /* options */
        }),
      ],
      fieldResolverEnhancers: ['interceptors'],
    }),
    PostsModule,
    CommonModule,
    AuthorsModule,
    RecipesModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
