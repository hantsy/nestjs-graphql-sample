import { SetMetadata } from '@nestjs/common';

export const HasPermissions = (...args: string[]) =>
  SetMetadata('has-permissions', args);
