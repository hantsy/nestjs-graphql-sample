import { SetMetadata } from '@nestjs/common';
import { HAS_PERMISSIONS_KEY } from './authz.constants';

export const HasPermissions = (...args: string[]) =>
  SetMetadata(HAS_PERMISSIONS_KEY, args);
