import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMemberFunctionDto {
  @ApiProperty({ description: 'ID da subcategoria', required: false })
  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @ApiProperty({ description: 'Observações adicionais', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Status ativo/inativo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
