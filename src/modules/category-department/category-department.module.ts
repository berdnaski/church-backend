import { Module } from '@nestjs/common';

import { PrismaModule } from '../../shared/prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { DepartmentModule } from '../department/department.module';
import { CategoryDepartmentController } from './category-department.controller';
import { CategoryDepartmentRepository } from './category-department.repository';
import { CategoryDepartmentService } from './category-department.service';

@Module({
  imports: [PrismaModule, CategoryModule, DepartmentModule],
  controllers: [CategoryDepartmentController],
  providers: [CategoryDepartmentService, CategoryDepartmentRepository],
  exports: [CategoryDepartmentService],
})
export class CategoryDepartmentModule {}
