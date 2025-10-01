import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './department.entity';
import { AddUserToDepartmentDto } from './dto/add-user-to-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

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
}
