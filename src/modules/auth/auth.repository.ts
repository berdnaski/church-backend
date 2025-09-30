import { Injectable } from '@nestjs/common';
import { User, Tenant, UserRole } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prismaService: PrismaService) {}

  async createTenant(name: string, slug: string): Promise<Tenant> {
    return this.prismaService.tenant.create({
      data: { name, slug, isActive: true },
    });
  }

  async createAdmin(userData: {
    adminName: string;
    adminEmail: string;
    password: string;
    tenantId: string;
  }): Promise<User & { roles: UserRole[] }> {
    return this.prismaService.user.create({
      data: {
        name: userData.adminName,
        email: userData.adminEmail,
        password: userData.password,
        tenantId: userData.tenantId,
        isActive: true,
        roles: {
          create: [{ role: 'ADMIN' }],
        },
      },
      include: { roles: true },
    });
  }

  async findUserByEmailAndTenant(
    email: string,
    tenantSlug: string,
  ): Promise<User & { roles: UserRole[] } | null> {
    return this.prismaService.user.findFirst({
      where: {
        email: email.toLowerCase(),
        tenant: { slug: tenantSlug, isActive: true },
        isActive: true,
      },
      include: { roles: true, tenant: true },
    });
  }
}
