import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    return this.prisma.subcategory.create({
      data: {
        name: createSubcategoryDto.name,
        description: createSubcategoryDto.description,
        category: {
          connect: { id: createSubcategoryDto.categoryId },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      },
    });
  }

  async findAll(categoryId: string) {
    return this.prisma.subcategory.findMany({
      where: { categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.subcategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.prisma.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.subcategory.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.subcategory.findMany({
      where: { categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      },
    });
  }
}
