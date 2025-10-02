import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CategoryDepartmentRepository } from './category-department.repository';
import { CreateCategoryDepartmentDto } from './dto/create-category-department.dto';
import { DepartmentService } from '../department/department.service';

@Injectable()
export class CategoryDepartmentService {
  constructor(
    private categoryDepartmentRepository: CategoryDepartmentRepository,
    private departmentService: DepartmentService,
    private prisma: PrismaService,
  ) {}

  async create(tenantId: string, createCategoryDepartmentDto: CreateCategoryDepartmentDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: createCategoryDepartmentDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Categoria com ID ${createCategoryDepartmentDto.categoryId} não encontrada`,
      );
    }

    await this.departmentService.findOne(createCategoryDepartmentDto.departmentId, tenantId);

    try {
      return await this.categoryDepartmentRepository.create(createCategoryDepartmentDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Esta categoria já está associada a este departamento');
      }
      throw error;
    }
  }

  async findAll(departmentId: string, tenantId: string) {
    await this.departmentService.findOne(departmentId, tenantId);

    return this.categoryDepartmentRepository.findAll(departmentId);
  }

  async findByCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${categoryId} não encontrada`);
    }

    return this.categoryDepartmentRepository.findByCategory(categoryId);
  }

  async findOne(id: string, tenantId: string) {
    const categoryDepartment = await this.categoryDepartmentRepository.findOne(id);
    if (!categoryDepartment) {
      throw new NotFoundException(`Relação categoria-departamento com ID ${id} não encontrada`);
    }

    await this.departmentService.findOne(categoryDepartment.departmentId, tenantId);

    return categoryDepartment;
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.categoryDepartmentRepository.remove(id);
  }
}
