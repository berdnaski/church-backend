import { Module } from '@nestjs/common';

import { PrismaModule } from '../../shared/prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { CategoryDepartmentModule } from '../category-department/category-department.module';
import { MemberFunctionController } from './member-function.controller';
import { MemberFunctionService } from './member-function.service';
import { MemberFunctionRepository } from './member-function.repository';

@Module({
  imports: [PrismaModule, CategoryModule, SubcategoryModule, CategoryDepartmentModule],
  controllers: [MemberFunctionController],
  providers: [MemberFunctionService, MemberFunctionRepository],
  exports: [MemberFunctionService],
})
export class MemberFunctionModule {}
