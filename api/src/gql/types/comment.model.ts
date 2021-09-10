import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class Comment {
  @Field((type) => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  postId: string;

  @Field((type) => Post)
  post: Post;
}
