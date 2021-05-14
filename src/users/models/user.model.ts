import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Post } from '../../posts/models/post.model';

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName?: string;

  @Field()
  email: string;

  @Field((type) => [Post])
  posts?: Post[];
}
