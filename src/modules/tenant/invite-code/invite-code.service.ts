import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { InviteCodeRepository } from './invite-code.repository';
import { InviteCodeEntity } from './invite-code.entity';

@Injectable()
export class InviteCodeService {
  constructor(
    private inviteCodeRepository: InviteCodeRepository,
    private prisma: PrismaService,
  ) {}

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase())
      .join('')
      .slice(0, 4);
  }

  async generateCode(tenantId: string, ttlHours = 24): Promise<InviteCodeEntity> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant não encontrado');
    }

    const initials = this.getInitials(tenant.name);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const code = `${initials}-${randomPart}`;

    const expiresAt = ttlHours > 0 ? new Date(Date.now() + ttlHours * 60 * 60 * 1000) : null;

    return this.inviteCodeRepository.createCode(tenantId, code, expiresAt);
  }

  async validateCode(code: string): Promise<InviteCodeEntity> {
    const invite = await this.inviteCodeRepository.findByCode(code);

    if (!invite) {
      throw new NotFoundException('Código inválido.');
    }

    if (!invite.isActive) {
      throw new BadRequestException('Código desativado.');
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new BadRequestException('Código expirado.');
    }

    return invite;
  }

  async deactivateCode(code: string): Promise<void> {
    await this.inviteCodeRepository.deactivateCode(code);
  }
}
