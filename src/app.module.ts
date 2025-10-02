import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { InviteCodeModule } from './modules/tenant/invite-code/invite-code.module';
import { JwtAuthGuard } from './common/guards/jwt-auth-guard';
import { UserModule } from './modules/user/user.module';
import { DepartmentModule } from './modules/department/department.module';
import { CategoryModule } from './modules/category/category.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { CategoryDepartmentModule } from './modules/category-department/category-department.module';
import { MemberFunctionModule } from './modules/member-function/member-function.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TenantModule,
    InviteCodeModule,
    UserModule,
    DepartmentModule,
    CategoryModule,
    SubcategoryModule,
    CategoryDepartmentModule,
    MemberFunctionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
