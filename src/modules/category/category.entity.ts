import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ description: 'ID único da categoria' })
  id: string;

  @ApiProperty({ description: 'Nome da categoria' })
  name: string;

  @ApiProperty({ description: 'Descrição da categoria', required: false })
  description?: string;

  @ApiProperty({ description: 'ID do tenant ao qual a categoria pertence' })
  tenantId: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
