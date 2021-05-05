import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
//TypeScript interfaces cannot be used to define GraphQL interfaces.
export abstract class Character {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;
}
