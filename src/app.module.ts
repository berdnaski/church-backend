import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { DepartmentModule } from './modules/department/department.module';
import { CategoryModule } from './modules/category/category.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { CategoryDepartmentModule } from './modules/category-department/category-department.module';
import { MemberFunctionModule } from './modules/member-function/member-function.module';
import { ScheduleModule } from './modules/schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TenantModule,
    UserModule,
    DepartmentModule,
    CategoryModule,
    SubcategoryModule,
    CategoryDepartmentModule,
    MemberFunctionModule,
    ScheduleModule,
  ],
})
export class AppModule {}
