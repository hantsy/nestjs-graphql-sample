import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field((type) => Int)
  offset = 0;

  @Field((type) => Int)
  limit = 10;
}
