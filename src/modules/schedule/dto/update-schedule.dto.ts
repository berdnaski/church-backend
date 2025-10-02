import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';

export enum ScheduleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @ApiProperty({ description: 'Status da escala', enum: ScheduleStatus, required: false })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}