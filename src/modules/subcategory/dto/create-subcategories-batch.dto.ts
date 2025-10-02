import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubcategoriesBatchDto {
  @ApiProperty({ description: 'ID da categoria' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Lista de nomes de subcategorias para criar', type: [String] })
  @IsArray()
  @IsString({ each: true })
  subcategoryNames: string[];
}
