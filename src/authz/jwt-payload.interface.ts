export interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  permissions?: string[];
}
