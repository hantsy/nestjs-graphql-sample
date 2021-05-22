import { SetMetadata } from '@nestjs/common';
import { HAS_PERMISSIONS_KEY } from './authz.constants';
import { PermissionType } from './permission-type.enum';

export const HasPermissions = (...args: PermissionType[]) =>
  SetMetadata(HAS_PERMISSIONS_KEY, args);
