import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreateCategoryDepartmentDto } from './dto/create-category-department.dto';

@Injectable()
export class CategoryDepartmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDepartmentDto: CreateCategoryDepartmentDto) {
    return this.prisma.categoryDepartment.create({
      data: {
        category: {
          connect: { id: createCategoryDepartmentDto.categoryId },
        },
        department: {
          connect: { id: createCategoryDepartmentDto.departmentId },
        },
      },
      select: {
        id: true,
        categoryId: true,
        departmentId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(departmentId: string) {
    return this.prisma.categoryDepartment.findMany({
      where: { departmentId },
      select: {
        id: true,
        categoryId: true,
        departmentId: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            subcategories: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.categoryDepartment.findMany({
      where: { categoryId },
      select: {
        id: true,
        categoryId: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.categoryDepartment.findUnique({
      where: { id },
      select: {
        id: true,
        categoryId: true,
        departmentId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.categoryDepartment.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  }
}
