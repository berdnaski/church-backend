import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Tenant } from '@prisma/client';

@Injectable()
export class TenantRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany({ where: { isActive: true } });
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant não encontrado');
    return tenant;
  }

  async update(
    id: string,
    data: Partial<{ name: string; slug: string; isActive: boolean }>,
  ): Promise<Tenant> {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  async deactivate(id: string): Promise<Tenant> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<Tenant> {
    return this.update(id, { isActive: true });
  }

  async updateTenant(
    id: string,
    data: Partial<{ name: string; slug: string; isActive: boolean; isPublic: boolean }>,
  ) {
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }
}
