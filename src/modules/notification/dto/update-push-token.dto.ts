import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';

export class UpdatePushTokenDto {
  @ApiProperty({ description: 'Token do dispositivo para push notifications' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Plataforma do dispositivo', enum: ['ios', 'android', 'web'] })
  @IsEnum(['ios', 'android', 'web'])
  platform: string;
}