import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  @MinLength(10)
  content: string;
}

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;
}

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  postId: string;

  @Field()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}
