import { ObjectType } from '@nestjs/graphql';
import { Character } from './character.model';

@ObjectType({
  implements: () => [Character],
})
export class Human implements Character {
  id: string;
  name: string;
}
