import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpvotePostInput {
  @Field((type) => String)
  postId: string;
}
