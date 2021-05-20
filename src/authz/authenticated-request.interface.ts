import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
  readonly user: any;
}
