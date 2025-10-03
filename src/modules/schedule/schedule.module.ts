import { Module, forwardRef } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleRepository } from './schedule.repository';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { DepartmentModule } from '../department/department.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, DepartmentModule, forwardRef(() => NotificationModule)],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
  exports: [ScheduleService],
})
export class ScheduleModule {}