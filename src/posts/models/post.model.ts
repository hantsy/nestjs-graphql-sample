import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
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
  @Field((type) => ID)
  id?: string;

  @Directive('@upper')
  @Field()
  title: string;

  @Field()
  content: string;

  @Field((type) => [Comment])
  comments?: Comment[];

  @Field((type) => User)
  author?: User;
}
