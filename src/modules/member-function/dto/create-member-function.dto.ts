import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemberFunctionDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID da categoria' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'ID da subcategoria', required: false })
  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @ApiProperty({ description: 'Observações adicionais', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Status ativo/inativo', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
