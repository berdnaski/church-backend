import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';

export enum MemberStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ABSENT = 'ABSENT',
}

export class CreateScheduleMemberDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID da subcategoria/função', required: false })
  @IsOptional()
  subcategoryId?: string;

  @ApiProperty({ description: 'Observações específicas', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Status do membro', enum: MemberStatus, default: MemberStatus.CONFIRMED })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;
}