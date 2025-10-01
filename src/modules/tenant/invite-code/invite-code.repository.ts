import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { InviteCodeEntity } from './invite-code.entity';

@Injectable()
export class InviteCodeRepository {
  constructor(private prisma: PrismaService) {}

  async createCode(
    tenantId: string,
    code: string,
    expiresAt: Date | null,
  ): Promise<InviteCodeEntity> {
    return this.prisma.inviteCode.create({
      data: { tenantId, code, isActive: true, expiresAt },
    });
  }

  async findByCode(code: string): Promise<InviteCodeEntity | null> {
    return this.prisma.inviteCode.findUnique({ where: { code } });
  }

  async deactivateCode(code: string): Promise<void> {
    await this.prisma.inviteCode.update({
      where: { code },
      data: { isActive: false },
    });
  }
}
