import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpvotePostInput {
  @Field((type) => Int)
  postId: number;
}
