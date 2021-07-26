import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
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

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];

  @Field((type) => User, { nullable: true })
  author?: User;

  @Field({ nullable: true })
  authorId?: string;
}
