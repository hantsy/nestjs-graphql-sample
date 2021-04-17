import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Comment } from './comment.model';

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

  @Field((type) => User)
  author: User;
}
