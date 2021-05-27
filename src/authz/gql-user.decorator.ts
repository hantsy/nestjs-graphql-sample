import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRepository } from '../database/repository/user.repository';
import { UserPrincipal } from './user-principal.interface';

export const GqlUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    GqlExecutionContext.create(ctx).getContext().user as UserPrincipal,
);
