import { InviteCode } from '@prisma/client';

export class InviteCodeEntity implements InviteCode {
  id: string;
  code: string;
  tenantId: string;
  isActive: boolean;
  expiresAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}
