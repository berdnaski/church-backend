import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAllByTenant(tenantId: string): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      include: { roles: true },
    });
    return users.map((user) => UserEntity.fromPrisma(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
    return user ? UserEntity.fromPrisma(user) : null;
  }

  async update(
    id: string,
    data: Partial<{ name: string; email: string; roles: string[] }>,
  ): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email?.toLowerCase(),
      },
      include: { roles: true },
    });

    if (data.roles && data.roles.length > 0) {
      await this.prisma.userRole.deleteMany({
        where: { userId: id },
      });

      for (const role of data.roles) {
        await this.prisma.userRole.create({
          data: {
            userId: id,
            role,
          },
        });
      }

      const userWithRoles = await this.prisma.user.findUnique({
        where: { id },
        include: { roles: true },
      });

      return UserEntity.fromPrisma(userWithRoles);
    }

    return UserEntity.fromPrisma(updatedUser);
  }

  async activate(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      include: { roles: true },
    });
    return UserEntity.fromPrisma(user);
  }

  async deactivate(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      include: { roles: true },
    });
    return UserEntity.fromPrisma(user);
  }
}
