import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    const response = exception.getResponse();
    const message =
      typeof response === 'string'
        ? response
        : (response as any).message || exception.message;

    return new Error(message);
  }
}
