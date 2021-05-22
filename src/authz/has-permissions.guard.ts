import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { HAS_PERMISSIONS_KEY } from './authz.constants';
import { PermissionType } from './permission-type.enum';

@Injectable()
export class HasPermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<PermissionType[]>(
      HAS_PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!routePermissions || routePermissions.length == 0) {
      return true;
    }
    const { user } = GqlExecutionContext.create(context).getContext()
      .req as AuthenticatedRequest;
    return (
      user.permissions &&
      user.permissions.some((r) => routePermissions.includes(r))
    );
  }
}
