import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleType } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiProperty({ description: 'Nova role do usuário', enum: UserRoleType })
  @IsEnum(UserRoleType)
  role: UserRoleType;

  @ApiProperty({ description: 'ID do departamento (opcional)', required: false })
  @IsOptional()
  @IsString()
  departmentId?: string;
}