import { Injectable, NotFoundException } from '@nestjs/common';

import { SubcategoryRepository } from './subcategory.repository';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { CategoryService } from '../category/category.service';
import { CreateSubcategoriesBatchDto } from './dto/create-subcategories-batch.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    private subcategoryRepository: SubcategoryRepository,
    private categoryService: CategoryService,
  ) {}

  async create(tenantId: string, createSubcategoryDto: CreateSubcategoryDto) {
    await this.categoryService.findOne(createSubcategoryDto.categoryId, tenantId);
    return this.subcategoryRepository.create(createSubcategoryDto);
  }

  async createBatch(tenantId: string, createBatchDto: CreateSubcategoriesBatchDto) {
    await this.categoryService.findOne(createBatchDto.categoryId, tenantId);

    const results: any[] = [];

    for (const name of createBatchDto.subcategoryNames) {
      const dto = {
        name,
        categoryId: createBatchDto.categoryId,
      } as CreateSubcategoryDto;

      const subcategory = await this.create(tenantId, dto);
      results.push(subcategory);
    }

    return results;
  }

  async findAll(categoryId: string, tenantId: string) {
    await this.categoryService.findOne(categoryId, tenantId);
    return this.subcategoryRepository.findAll(categoryId);
  }

  async findOne(id: string, tenantId: string) {
    const subcategory = await this.subcategoryRepository.findOne(id);
    if (!subcategory) {
      throw new NotFoundException(`Subcategoria com ID ${id} não encontrada`);
    }

    await this.categoryService.findOne(subcategory.categoryId, tenantId);

    return subcategory;
  }

  async update(id: string, tenantId: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    await this.findOne(id, tenantId);
    return this.subcategoryRepository.update(id, updateSubcategoryDto);
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.subcategoryRepository.remove(id);
  }
}
