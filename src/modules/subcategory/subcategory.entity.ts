import { ApiProperty } from '@nestjs/swagger';

export class Subcategory {
  @ApiProperty({ description: 'ID único da subcategoria' })
  id: string;

  @ApiProperty({ description: 'Nome da subcategoria' })
  name: string;

  @ApiProperty({ description: 'Descrição da subcategoria', required: false })
  description?: string;

  @ApiProperty({ description: 'ID da categoria pai' })
  categoryId: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
