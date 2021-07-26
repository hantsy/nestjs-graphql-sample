import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserResult {
  @Field()
  success: boolean;

  @Field()
  message?: string;
}
