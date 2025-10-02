import { Module } from '@nestjs/common';

import { PrismaModule } from '../../shared/prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryRepository } from './subcategory.repository';

@Module({
  imports: [PrismaModule, CategoryModule],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, SubcategoryRepository],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
