import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class Comment {
  @Field((type) => ID)
  id: string;

  @Field()
  content: string;

  @Field((type) => Post)
  post: Post;
}
