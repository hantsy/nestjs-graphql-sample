import {
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

@InputType()
class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}

// @InputType()
// export class UpdateUserInput extends PartialType(User, InputType) {}

@InputType()
export class UpdateEmailInput extends PickType(CreateUserInput, [
  'email',
] as const) {}

@InputType()
export class UpdateUserInfoInput extends OmitType(CreateUserInput, [
  'email',
] as const) {}

@ObjectType()
export class AdditionalUserInfo {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

@InputType()
export class UpdateUserAddtionalInput extends IntersectionType(
  CreateUserInput,
  AdditionalUserInfo,
) {}

@InputType()
export class UpdatePartialUserInput extends PartialType(
  OmitType(CreateUserInput, ['email'] as const),
) {}
