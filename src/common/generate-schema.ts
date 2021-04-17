import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import { printSchema } from 'graphql';

async function generateSchema() {
  // const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  // await app.init();
  // const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  // const schema = await gqlSchemaFactory.create([RecipesResolver]);
  //   const schema = await gqlSchemaFactory.create(
  //     [RecipesResolver, AuthorsResolver, PostsResolvers],
  //     [DurationScalar, DateScalar],
  //   );
  //   const schema = await gqlSchemaFactory.create([RecipesResolver], {
  //     skipCheck: true,
  //     orphanedTypes: [],
  //   });
  //console.log(printSchema(schema));
}
