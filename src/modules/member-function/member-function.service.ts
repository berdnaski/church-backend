import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { MemberFunctionRepository } from './member-function.repository';
import { CreateMemberFunctionDto } from './dto/create-member-function.dto';
import { UpdateMemberFunctionDto } from './dto/update-member-function.dto';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { CategoryDepartmentService } from '../category-department/category-department.service';

@Injectable()
export class MemberFunctionService {
  constructor(
    private memberFunctionRepository: MemberFunctionRepository,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private categoryDepartmentService: CategoryDepartmentService,
    private prisma: PrismaService,
  ) {}

  async create(tenantId: string, createMemberFunctionDto: CreateMemberFunctionDto) {
    await this.categoryService.findOne(createMemberFunctionDto.categoryId, tenantId);
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: createMemberFunctionDto.userId,
        departmentId: { not: null },
      },
      include: {
        department: true,
      },
    });

    if (userRoles.length > 0) {
      let categoryBelongsToDepartment = false;
      for (const userRole of userRoles) {
        if (userRole.departmentId) {
          const departmentCategories = await this.prisma.categoryDepartment.findMany({
            where: { departmentId: userRole.departmentId },
          });
          if (
            departmentCategories.some((dc) => dc.categoryId === createMemberFunctionDto.categoryId)
          ) {
            categoryBelongsToDepartment = true;
            break;
          }
        }
      }

      if (!categoryBelongsToDepartment) {
        throw new ConflictException(
          'A categoria selecionada não está associada a nenhum departamento do usuário',
        );
      }
    }

    if (createMemberFunctionDto.subcategoryId) {
      const subcategory = await this.subcategoryService.findOne(
        createMemberFunctionDto.subcategoryId,
        tenantId,
      );

      if (subcategory.categoryId !== createMemberFunctionDto.categoryId) {
        throw new ConflictException('A subcategoria não pertence à categoria especificada');
      }
    }

    try {
      return await this.memberFunctionRepository.create(createMemberFunctionDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Este usuário já possui esta função específica');
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.memberFunctionRepository.findAll(userId);
  }

  async findByCategory(categoryId: string, tenantId: string) {
    await this.categoryService.findOne(categoryId, tenantId);

    return this.memberFunctionRepository.findByCategory(categoryId);
  }

  async findBySubcategory(subcategoryId: string) {
    return this.memberFunctionRepository.findBySubcategory(subcategoryId);
  }

  async findOne(id: string, tenantId: string) {
    const memberFunction = await this.memberFunctionRepository.findOne(id);
    if (!memberFunction) {
      throw new NotFoundException(`Função de membro com ID ${id} não encontrada`);
    }
    await this.categoryService.findOne(memberFunction.categoryId, tenantId);

    return memberFunction;
  }

  async update(id: string, tenantId: string, updateMemberFunctionDto: UpdateMemberFunctionDto) {
    const memberFunction = await this.findOne(id, tenantId);

    if (updateMemberFunctionDto.subcategoryId) {
      const subcategory = await this.subcategoryService.findOne(
        updateMemberFunctionDto.subcategoryId,
        tenantId,
      );

      if (subcategory.categoryId !== memberFunction.categoryId) {
        throw new ConflictException('A subcategoria não pertence à categoria especificada');
      }
    }
    return this.memberFunctionRepository.update(id, updateMemberFunctionDto);
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.memberFunctionRepository.remove(id);
  }
}
