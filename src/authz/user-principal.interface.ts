import { PermissionType } from './permission-type.enum';
export interface UserPrincipal {
  userId: string;
  email?: string;
  name?: string;
  permissions?: PermissionType[];
}
