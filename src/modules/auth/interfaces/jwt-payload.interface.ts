export interface JwtPayload {
  sub: string;
  tenantId: string;
  roles: string[];
  email?: string;
}
