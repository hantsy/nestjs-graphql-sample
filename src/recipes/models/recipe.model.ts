import { Extensions, Field, ObjectType } from '@nestjs/graphql';
import { loggerMiddleware } from '../../common/logger.middleware';
import { Character } from '../../common/character.model';

@ObjectType()
export class Recipe {
  @Field({ middleware: [loggerMiddleware] })
  //@Field({ complexity: 3 })
  //@Field({ complexity: (options: ComplexityEstimatorArgs) => ... })
  // Check role
  //  @Field({ middleware: [checkRoleMiddleware] })
  //@Extensions({ role: Role.ADMIN })
  title: string;

  //@ResolveField(() => String, { middleware: [loggerMiddleware] })
  // title() {
  //   return 'Placeholder';
  // }
} //extends Character {}
