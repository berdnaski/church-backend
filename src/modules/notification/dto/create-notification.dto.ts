import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { IsString, IsEnum, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Título da notificação' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Mensagem da notificação' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Tipo da notificação', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Dados adicionais da notificação', required: false })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiProperty({ description: 'IDs dos usuários que receberão a notificação' })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}