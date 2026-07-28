import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Post')
export class PostType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [CommentType], { nullable: 'items' })
  comments?: CommentType[];
}

@ObjectType('Comment')
export class CommentType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  postId: string;

  @Field()
  createdAt: Date;
}
