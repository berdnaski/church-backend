import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreateMemberFunctionDto } from './dto/create-member-function.dto';
import { UpdateMemberFunctionDto } from './dto/update-member-function.dto';

@Injectable()
export class MemberFunctionRepository {
  constructor(private prisma: PrismaService) {}

  async create(createMemberFunctionDto: CreateMemberFunctionDto) {
    return this.prisma.memberFunction.create({
      data: {
        user: {
          connect: { id: createMemberFunctionDto.userId },
        },
        category: {
          connect: { id: createMemberFunctionDto.categoryId },
        },
        subcategory: createMemberFunctionDto.subcategoryId
          ? {
              connect: { id: createMemberFunctionDto.subcategoryId },
            }
          : undefined,
        notes: createMemberFunctionDto.notes,
        isActive: createMemberFunctionDto.isActive ?? true,
      },
      select: {
        id: true,
        categoryId: true,
        subcategoryId: true,
        notes: true,
        isActive: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: createMemberFunctionDto.subcategoryId
          ? {
              select: {
                id: true,
                name: true,
              },
            }
          : false,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.memberFunction.findMany({
      where: { userId },
      select: {
        id: true,
        categoryId: true,
        subcategoryId: true,
        notes: true,
        isActive: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.memberFunction.findMany({
      where: { categoryId },
      select: {
        id: true,
        userId: true,
        subcategoryId: true,
        notes: true,
        isActive: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findBySubcategory(subcategoryId: string) {
    return this.prisma.memberFunction.findMany({
      where: { subcategoryId },
      select: {
        id: true,
        userId: true,
        categoryId: true,
        notes: true,
        isActive: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.memberFunction.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        categoryId: true,
        subcategoryId: true,
        notes: true,
        isActive: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateMemberFunctionDto: UpdateMemberFunctionDto) {
    return this.prisma.memberFunction.update({
      where: { id },
      data: {
        subcategory: updateMemberFunctionDto.subcategoryId
          ? {
              connect: { id: updateMemberFunctionDto.subcategoryId },
            }
          : undefined,
        notes: updateMemberFunctionDto.notes,
        isActive: updateMemberFunctionDto.isActive,
      },
      select: {
        id: true,
        categoryId: true,
        subcategoryId: true,
        notes: true,
        isActive: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.memberFunction.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  }
}
