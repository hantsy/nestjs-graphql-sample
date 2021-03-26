import { UseGuards } from '@nestjs/common';
import {
  Args,
  createUnionType,
  Directive,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthGuard } from '../common/auth.guard';

import { PostsService } from '../posts/posts.service';
import { AuthorsService } from './authors.service';
import { GetAuthorArgs } from './dto/get-author.args';
import { Author } from './models/author.model';
import { Book } from './models/book.model';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [Author, Book],
  resolveType(value) {
    if (value.name) {
      return Author;
    }
    if (value.title) {
      return Book;
    }
    return null;
  },
});

@Resolver((of) => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
  ) {}

  @Directive(
    '@deprecated(reason: "This query will be removed in the next version")',
  )
  @Query((returns) => Author, { name: 'author' })
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Author)
  async authors(@Args() args: GetAuthorArgs) {
    //return this.authorsService.findOneById(id);
  }

  @ResolveField()
  async posts(@Parent() author: Author) {
    const { id } = author;
    return this.postsService.findAll({ authorId: id });
  }

  @Query((returns) => [ResultUnion])
  search(): Array<typeof ResultUnion> {
    return [new Author(), new Book()];
  }
}
