import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'DateTime custom scalar type';

  parseValue(value: unknown): Date {
    return new Date(value as number);
  }

  serialize(value: unknown): number {
    if (value instanceof Date) {
      return value.getTime();
    }
    return value as number;
  }

  parseLiteral(ast: ValueNode): Date | null {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  }
}
