import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDepartmentDto {
  @ApiProperty({ description: 'ID da categoria' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'ID do departamento' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;
}
