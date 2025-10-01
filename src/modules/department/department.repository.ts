import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { DepartmentEntity } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    tenantId: string,
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentEntity> {
    const department = await this.prisma.department.create({
      data: {
        name: createDepartmentDto.name,
        tenantId,
        features: JSON.stringify(createDepartmentDto.features),
      },
    });

    return DepartmentEntity.fromPrisma(department);
  }

  async findAll(tenantId: string): Promise<DepartmentEntity[]> {
    const departments = await this.prisma.department.findMany({
      where: { tenantId },
    });

    return departments.map(DepartmentEntity.fromPrisma);
  }

  async findOne(id: string, tenantId: string): Promise<DepartmentEntity | null> {
    const department = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });

    if (!department) return null;
    return DepartmentEntity.fromPrisma(department);
  }

  async update(
    id: string,
    tenantId: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentEntity> {
    const updateData: any = { ...updateDepartmentDto };

    if (updateData.features) {
      updateData.features = JSON.stringify(updateData.features);
    }

    const department = await this.prisma.department.update({
      where: { id },
      data: updateData,
    });

    return DepartmentEntity.fromPrisma(department);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.prisma.department.delete({
      where: { id },
    });
  }

  async addUserToDepartment(departmentId: string, userId: string, role: string): Promise<void> {
    await this.prisma.userRole.create({
      data: {
        userId,
        departmentId,
        role,
      },
    });
  }

  async removeUserFromDepartment(departmentId: string, userId: string): Promise<void> {
    await this.prisma.userRole.deleteMany({
      where: {
        departmentId,
        userId,
      },
    });
  }

  async getDepartmentUsers(departmentId: string): Promise<any[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { departmentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
      },
    });

    return userRoles.map((userRole) => ({
      ...userRole.user,
      role: userRole.role,
    }));
  }
}
