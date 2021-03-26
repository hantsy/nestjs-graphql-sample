import { Field, ID, InterfaceType, ObjectType } from '@nestjs/graphql';

/*
@InterfaceType({
  resolveType(book) {
    if (book.colors) {
      return ColoringBook;
    }
    return TextBook;
  },
})
export abstract class Book {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;
}

@ObjectType()
class ColoringBook extends Book {}

@ObjectType()
class TextBook extends Book {}
*/

@ObjectType()
export class Book {
  @Field()
  title: string;
}
