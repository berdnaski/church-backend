import { ApiProperty } from '@nestjs/swagger';

export class CategoryDepartment {
  @ApiProperty({ description: 'ID único da relação categoria-departamento' })
  id: string;

  @ApiProperty({ description: 'ID da categoria' })
  categoryId: string;

  @ApiProperty({ description: 'ID do departamento' })
  departmentId: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
