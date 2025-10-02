import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(tenantId: string, createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(tenantId, createCategoryDto);
    return category;
  }

  async findAll(tenantId: string) {
    return this.categoryRepository.findAll(tenantId);
  }

  async findOne(id: string, tenantId: string) {
    const category = await this.categoryRepository.findOne(id, tenantId);
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }
    return category;
  }

  async update(id: string, tenantId: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id, tenantId);
    return this.categoryRepository.update(id, tenantId, updateCategoryDto);
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.categoryRepository.remove(id, tenantId);
  }
}
