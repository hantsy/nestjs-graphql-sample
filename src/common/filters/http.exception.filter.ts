import {
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const gqlHost = GqlArgumentsHost.create(host);
    console.log('gql host: %0', JSON.stringify(gqlHost));
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(exception);
  }
}
