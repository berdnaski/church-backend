import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './department.entity';
import { AddUserToDepartmentDto } from './dto/add-user-to-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private prisma: PrismaService,
  ) {}

  async create(
    tenantId: string,
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentEntity> {
    return this.departmentRepository.create(tenantId, createDepartmentDto);
  }

  async findAll(tenantId: string): Promise<DepartmentEntity[]> {
    return this.departmentRepository.findAll(tenantId);
  }

  async findOne(id: string, tenantId: string): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.findOne(id, tenantId);
    if (!department) {
      throw new NotFoundException('Departamento não encontrado');
    }
    return department;
  }

  async update(
    id: string,
    tenantId: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentEntity> {
    await this.findOne(id, tenantId);
    return this.departmentRepository.update(id, tenantId, updateDepartmentDto);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.findOne(id, tenantId);
    await this.departmentRepository.remove(id, tenantId);
  }

  async addUserToDepartment(
    departmentId: string,
    tenantId: string,
    dto: AddUserToDepartmentDto,
  ): Promise<void> {
    const department = await this.findOne(departmentId, tenantId);
    if (!department) {
      throw new NotFoundException('Departamento não encontrado');
    }

    await this.departmentRepository.addUserToDepartment(departmentId, dto.userId, dto.role);
  }

  async removeUserFromDepartment(
    departmentId: string,
    tenantId: string,
    userId: string,
  ): Promise<void> {
    const department = await this.findOne(departmentId, tenantId);
    if (!department) {
      throw new NotFoundException('Departamento não encontrado');
    }

    await this.departmentRepository.removeUserFromDepartment(departmentId, userId);
  }

  async getDepartmentUsers(departmentId: string, tenantId: string): Promise<any[]> {
    const department = await this.findOne(departmentId, tenantId);
    if (!department) {
      throw new NotFoundException('Departamento não encontrado');
    }

    return this.departmentRepository.getDepartmentUsers(departmentId);
  }

  async findSubcategoriesByCategory(
    departmentId: string,
    categoryId: string,
    tenantId: string,
  ): Promise<any[]> {
    const department = await this.findOne(departmentId, tenantId);
    if (!department) {
      throw new NotFoundException('Departamento não encontrado');
    }
    const categoryDepartment = await this.prisma.categoryDepartment.findFirst({
      where: {
        departmentId,
        categoryId,
      },
    });

    if (!categoryDepartment) {
      throw new NotFoundException('Categoria não está associada a este departamento');
    }

    const subcategories = await this.prisma.subcategory.findMany({
      where: {
        categoryId,
      },
    });

    return subcategories;
  }
}
