import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommentInput {
  @Field()
  postId: string;

  @Field()
  content: string;
}
