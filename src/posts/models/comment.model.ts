import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class Comment {
  @Field((type) => Int)
  id: number;

  @Field()
  content: string;

  @Field((type) => Post)
  post: Post;
}
