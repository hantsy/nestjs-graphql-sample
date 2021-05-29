import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  name?: string;

  @Field()
  email: string;

  @Field((type) => [Post])
  posts?: Post[];
}
