import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({ description: 'Nome da subcategoria' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição da subcategoria', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID da categoria pai' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
