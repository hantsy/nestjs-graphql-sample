import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class User {
  @Field((type) => ID)
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field((type) => [Post], { nullable: true })
  posts?: Post[];
}
