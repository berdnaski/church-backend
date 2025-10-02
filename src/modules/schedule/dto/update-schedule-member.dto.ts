import { PartialType } from '@nestjs/swagger';
import { CreateScheduleMemberDto } from './create-schedule-member.dto';

export class UpdateScheduleMemberDto extends PartialType(CreateScheduleMemberDto) {}