import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min, Max, IsOptional } from 'class-validator';

@ArgsType()
export class PostsArgs {
  @Field({ nullable: true, defaultValue: '' })
  @IsOptional()
  keyword?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Min(0)
  @IsOptional()
  skip?: number;

  @Field(() => Int, { nullable: true, defaultValue: 25 })
  @Min(1)
  @Max(50)
  @IsOptional()
  take?: number;
}
