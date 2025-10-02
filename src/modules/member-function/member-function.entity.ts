import { ApiProperty } from '@nestjs/swagger';

export class MemberFunction {
  @ApiProperty({ description: 'ID único da função do membro' })
  id: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'ID da categoria' })
  categoryId: string;

  @ApiProperty({ description: 'ID da subcategoria', required: false })
  subcategoryId?: string;

  @ApiProperty({ description: 'Observações adicionais', required: false })
  notes?: string;

  @ApiProperty({ description: 'Status ativo/inativo' })
  isActive: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
