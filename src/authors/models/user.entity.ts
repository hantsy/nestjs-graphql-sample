import { Directive, ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from '../../posts/models/post.model';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field((type) => ID)
  @Directive('@external')
  id: number;

  @Field((type) => [Post])
  posts?: Post[];
}
