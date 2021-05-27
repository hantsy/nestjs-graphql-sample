import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, isNotEmpty, MinLength } from 'class-validator';

@InputType()
export class PostInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  @MinLength(10)
  content: string;
}
