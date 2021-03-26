import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Author } from '../../authors/models/author.model';
import { Comment } from './comment.model';

import { User } from '../../authors/models/user.entity';

// @ObjectType()
// @Directive('@key(fields: "id")')
// export class Post {
//   @Field((type) => ID)
//   id: number;

//   @Field()
//   title: string;

//   @Field((type) => Int)
//   authorId: number;

//   @Field((type) => User)
//   user?: User;
// }

@ObjectType()
export class Post {
  @Field((type) => Int)
  id: number;

  @Directive('@upper')
  @Field()
  title: string;

  @Field()
  content: string;

  @Field((type) => Int, { nullable: true })
  votes?: number;

  @Field((type) => [Comment])
  comments: Comment[];

  @Field((type) => Author)
  author: Author;

  @Field((type) => Int)
  authorId: number;
}
