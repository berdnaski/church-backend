import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSubcategoryDto {
  @ApiProperty({ description: 'Nome da subcategoria', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Descrição da subcategoria', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
