import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Título da escala' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descrição da escala', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Data e hora do evento' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Data e hora de fim do evento', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'ID do departamento' })
  @IsNotEmpty()
  departmentId: string;
}