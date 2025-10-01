import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FeatureDto {
  @ApiProperty({ description: 'Nome da funcionalidade', example: 'Gerenciar membros' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição da funcionalidade',
    example: 'Permite gerenciar membros do departamento',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Nome do departamento', example: 'Louvor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Funcionalidades do departamento',
    type: [FeatureDto],
    example: [
      { name: 'Gerenciar membros', description: 'Permite gerenciar membros do departamento' },
      { name: 'Gerenciar escalas', description: 'Permite gerenciar escalas do departamento' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features: FeatureDto[];
}
