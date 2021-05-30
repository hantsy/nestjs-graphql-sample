import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CommentInput {
  @Field()
  postId: string;

  @Field()
  @IsNotEmpty()
  @MinLength(10)
  content: string;
}
