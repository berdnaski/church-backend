import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        ...(tenantId ? { tenant: { connect: { id: tenantId } } } : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
        tenantId: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.category.findMany({
      where: {
        OR: [{ tenantId: null }, { tenantId: tenantId }],
      },
      select: {
        id: true,
        name: true,
        description: true,
        tenantId: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.category.findFirst({
      where: {
        id,
        OR: [{ tenantId: null }, { tenantId: tenantId }],
      },
      select: {
        id: true,
        name: true,
        description: true,
        tenantId: true,
        subcategories: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        departments: {
          select: {
            id: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, tenantId: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: { id },
      select: {
        id: true,
        tenantId: true,
      },
    });

    if (category && category.tenantId === tenantId) {
      return this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
        select: {
          id: true,
          name: true,
          description: true,
          tenantId: true,
        },
      });
    }

    return category;
  }

  async remove(id: string, tenantId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id },
      select: {
        id: true,
        tenantId: true,
      },
    });
    if (category && category.tenantId === tenantId) {
      return this.prisma.category.delete({
        where: { id },
        select: {
          id: true,
        },
      });
    }

    return category;
  }
}
