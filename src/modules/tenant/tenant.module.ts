import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

import { TenantService } from './tenant.service';
import { TenantRepository } from './tenant.repository';
import { TenantController } from './tenant.controller';

@Module({
  imports: [PrismaModule],
  providers: [TenantService, TenantRepository],
  controllers: [TenantController],
  exports: [TenantService],
})
export class TenantModule {}
